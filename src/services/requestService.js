"use strict";

let models = require('../models/request.model');
let friendModels = require('../models/friendlist.model');
var Promise = require('bluebird');
var rp = require('request-promise');
const sgMail = require('@sendgrid/mail');

var cachedProfiles = new Map();

class RequestService {
    static getRequests(userId, received, logged) {
        return new Promise((resolve, reject) => {
            if (userId !== logged && !received) reject(403);
            else {
                rp({
                    url: 'https://animea-gateway.herokuapp.com/profile/api/v1/profile/' + userId
                }).then((user) => {
                    if(!received){
                        models.RequestM.find({userId: userId}, (err, requests) => {
                            if (err) reject(404);
                            else {
                                var promises = [];
                                var retReqs = [];
                                requests.forEach(req => {
                                    promises.push(new Promise((resolve, reject) => {
                                        this.getRequestData(req).then(retReq => {
                                            retReqs.push(retReq);
                                            resolve();
                                        });
                                    }));
                                });
                                Promise.all(promises).then(() => {
                                    resolve(retReqs);
                                });
                            }
                        });
                    }else{
                        models.RequestM.find({friendId: userId}, (err, requests) => {
                            if (err) reject(404);
                            else {
                                var promises = [];
                                var retReqs = [];
                                requests.forEach(req => {
                                    promises.push(new Promise((resolve, reject) => {
                                        this.getRequestData(req).then(retReq => {
                                            retReqs.push(retReq);
                                            resolve();
                                        });
                                    }));
                                });
                                Promise.all(promises).then(() => {
                                    resolve(retReqs);
                                });
                            }
                        });
                    }
                }).catch(() => {
                    reject(404);
                });
            }
        });
    }

    static getRequestData(request) {
        return new Promise((resolve, reject) => {
            if (cachedProfiles.has(request.userId)) {
                console.log('Retrieving user from cache');
                var user = cachedProfiles.get(request.userId);
                if (cachedProfiles.has(request.friendId)) {
                    console.log('Retrieving friend from cache');
                    var friend = cachedProfiles.get(request.friendId);
                    resolve({
                        id: request.id,
                        user: JSON.parse(user),
                        friend: JSON.parse(friend),
                        message: request.message
                    });
                } else {
                    rp({
                        url: 'https://animea-gateway.herokuapp.com/profile/api/v1/profile/' + request.friendId
                    }).then((friend) => {
                        cachedProfiles.set(request.friendId, friend);
                        resolve({
                            id: request.id,
                            user: JSON.parse(user),
                            friend: JSON.parse(friend),
                            message: request.message
                        });
                    });
                }
            } else if (cachedProfiles.has(request.friendId)) {
                console.log('Retrieving friend from cache');
                var friend = cachedProfiles.get(request.friendId);
                rp({
                    url: 'https://animea-gateway.herokuapp.com/profile/api/v1/profile/' + request.userId
                }).then((user) => {
                    cachedProfiles.set(request.userId, user);
                    resolve({
                        id: request.id,
                        user: JSON.parse(user),
                        friend: JSON.parse(friend),
                        message: request.message
                    });
                });
            } else {
                rp({
                    url: 'https://animea-gateway.herokuapp.com/profile/api/v1/profile/' + request.userId
                }).then((user) => {
                    cachedProfiles.set(request.userId, user);
                    rp({
                        url: 'https://animea-gateway.herokuapp.com/profile/api/v1/profile/' + request.friendId
                    }).then((friend) => {
                        cachedProfiles.set(request.friendId, friend);
                        resolve({
                            id: request.id,
                            user: JSON.parse(user),
                            friend: JSON.parse(friend),
                            message: request.message
                        });
                    });
                });
            }
        });
    }
    
    static createRequest(req, logged, noemail) {
        return new Promise((resolve, reject) => {
            if (req.userId !== logged) resolve(403);
            else {
                rp({
                    url: 'https://animea-gateway.herokuapp.com/profile/api/v1/profile/' + req.userId
                }).then(userData => {
                    rp({
                        url: 'https://animea-gateway.herokuapp.com/profile/api/v1/profile/' + req.friendId
                    }).then(friendData => {
                        models.RequestM.findOne({userId: req.userId, friendId: req.friendId}, (err, res) => {
                            if (res) resolve(400);
                            else {
                                friendModels.FriendList.findOne({userId: req.userId}, (err, friends) => {
                                    if (!friends || !friends.friends.includes(req.friendId)) {
                                        req.id = Math.round(Math.random() * 1000);
                                        models.RequestM.create(req, (err) => {
                                            if (!err) {
                                                if (!noemail) {
                                                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                                                    const msg = {
                                                        to: JSON.parse(friendData).email,
                                                        from: 'animea.cloud@gmail.com',
                                                        subject: 'Animea - New friend request',
                                                        text: 'You have a new friend request from ' + JSON.parse(userData).name + '!\nCheck it out at http://animea-frontend.herokuapp.com/request/' + req.id + '.'
                                                    };
                                                    sgMail.send(msg);
                                                }
                                                resolve(201);
                                            } else resolve(400);
                                        });
                                    } else {
                                        resolve(400);
                                    }
                                });
                            }
                        });
                    }).catch(() => {
                        resolve(404);
                    });
                }).catch(() => {
                    resolve(404);
                });
            }
        });
    }

    static acceptRequest(reqId, logged) {
        return new Promise((resolve, reject) => {
            models.RequestM.findOne({id: reqId}, (err, req) => {
                if (req) {
                    if (req.friendId != logged) resolve(403);
                    else {
                        friendModels.FriendList.findOne({userId: req.userId}, (err, friends) => {
                            if (!friends) {
                                friendModels.FriendList.create({
                                    userId: req.userId,
                                    friends: [req.friendId]
                                }, (err) => {
                                    models.RequestM.deleteOne({id: reqId}, (err) => {
                                        resolve(204);
                                    });
                                });
                            } else {
                                friends.friends.push(req.friendId);
                                friendModels.FriendList.updateOne({userId: req.userId}, {friends: friends.friends}, (err) => {
                                    models.RequestM.deleteOne({id: reqId}, (err) => {
                                        resolve(204);
                                    });
                                });
                            }
                        });
                        //buscar el amigo y actualizarle la lista de amigos al aceptar la request
                        friendModels.FriendList.findOne({userId: req.friendId}, (err, friends) => {
                            if (!friends) {
                                friendModels.FriendList.create({
                                    userId: req.friendId,
                                    friends: [req.userId]
                                }, (err) => {
                                    models.RequestM.deleteOne({id: reqId}, (err) => {
                                        resolve(204);
                                    });
                                });
                            } else {
                                friends.friends.push(req.userId);
                                friendModels.FriendList.updateOne({userId: req.friendId}, {friends: friends.friends}, (err) => {
                                    models.RequestM.deleteOne({id: reqId}, (err) => {
                                        resolve(204);
                                    });
                                });
                            }
                        });
                    }
                } else resolve(404);
            });
        });
    }

    //Funciona
    static deleteAllRequests(userId, logged){
        return new Promise((resolve,reject)=>{
            if (userId !== logged) reject(403);
            else {
                rp({
                    url: 'https://animea-gateway.herokuapp.com/profile/api/v1/profile/' + userId
                }).then(() => {
                    models.RequestM.deleteMany({userId: userId},(err)=>{
                        if(err) resolve(404)
                        else resolve(204);
                    });
                }).catch(() => {
                    resolve(404);
                });
            }
        });
    }

    //Funciona
    static getFriendRequest(reqId, logged){
        return new Promise((resolve,reject) =>{
            models.RequestM.findOne({id: reqId},(err,request) =>{
                if(err) reject(404);
                else{
                    if (!request) reject(404);
                    else {
                        if (request.userId != logged && request.friendId != logged) reject(403);
                        this.getRequestData(request).then(req => {
                            resolve(req);
                        });
                    }
                }
            });
        });
    }

    //TRY
    static updateFriendRequest(reqId, req, logged){
        return new Promise(function (resolve,reject){
            models.RequestM.findOne({id: reqId},(err,request) =>{
                if(err) resolve(404);
                else{
                    if (!request) resolve(404);
                    else {
                        if (request.userId != logged) resolve(403);
                        else {
                            models.RequestM.updateOne({id: reqId}, req, (err) => {
                                if (err) resolve(400);
                                else resolve(204);
                            });
                        }
                    }
                }
            });
        });
    }

    //Funciona
    static deleteFriendRequest(reqId, logged){
        return new Promise((resolve,reject) =>{
            models.RequestM.findOne({id: reqId},(err,request) =>{
                if(err) resolve(404);
                else{
                    if (!request) resolve(404);
                    else {
                        if (request.userId != logged && request.friendId != logged) resolve(403);
                        else {
                            models.RequestM.deleteOne({id: reqId}, (err) => {
                                if (err) resolve(404);
                                else resolve(204);
                            });
                        }
                    }
                }
            });
        });
    } 
}

module.exports = RequestService;