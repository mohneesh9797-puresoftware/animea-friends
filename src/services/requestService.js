"use strict";

let models = require('../models/request.model');
let friendModels = require('../models/friendlist.model');
var Promise = require('bluebird');
var rp = require('request-promise');

class RequestService {
    static getRequests(userId,received) {
        return new Promise((resolve, reject) => {
            rp({
                url: 'https://185.176.5.147:7400/profile/api/profile/' + userId,
                insecure: true,
                rejectUnauthorized: false
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
        });
    }

    static getRequestData(request) {
        return new Promise((resolve, reject) => {
            rp({
                url: 'https://185.176.5.147:7400/profile/api/profile/' + request.userId,
                insecure: true,
                rejectUnauthorized: false
            }).then((user) => {
                rp({
                    url: 'https://185.176.5.147:7400/profile/api/profile/' + request.friendId,
                    insecure: true,
                    rejectUnauthorized: false
                }).then((friend) => {
                    resolve({
                        id: request.id,
                        user: JSON.parse(user),
                        friend: JSON.parse(friend),
                        message: request.message
                    });
                });
            });
        });
    }
    
    static createRequest(req) {
        return new Promise((resolve, reject) => {
            rp({
                url: 'https://185.176.5.147:7400/profile/api/profile/' + req.userId,
                insecure: true,
                rejectUnauthorized: false
            }).then(() => {
                rp({
                    url: 'https://185.176.5.147:7400/profile/api/profile/' + req.friendId,
                    insecure: true,
                    rejectUnauthorized: false
                }).then(() => {
                    models.RequestM.findOne({userId: req.userId, friendId: req.friendId}, (err, res) => {
                        if (res) resolve(400);
                        else {
                            friendModels.FriendList.findOne({userId: req.userId}, (err, friends) => {
                                if (!friends || !friends.friends.includes(req.friendId)) {
                                    req.id = Math.round(Math.random() * 1000);
                                    models.RequestM.create(req, (err) => {
                                        if (!err) resolve(201);
                                        else resolve(500);
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
        });
    }

    static acceptRequest(reqId) {
        return new Promise((resolve, reject) => {
            models.RequestM.findOne({id: reqId}, (err, req) => {
                if (req) {
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

                } else resolve(404)
            });
        });
    }

    //Funciona
    static deleteAllRequests(userId){
        return new Promise((resolve,reject)=>{
            rp({
                url: 'https://185.176.5.147:7400/profile/api/profile/' + userId,
                insecure: true,
                rejectUnauthorized: false
            }).then(() => {
                models.RequestM.deleteMany({userId: userId},(err)=>{
                    if(err) resolve(404)
                    else resolve(204);
                });
            }).catch(() => {
                resolve(404);
            })
        });
    }

    //Funciona
    static getFriendRequest(reqId){
        return new Promise((resolve,reject) =>{
            models.RequestM.findOne({id: reqId},(err,request) =>{
                if(err) reject(404);
                else{
                    if (!request) reject(404);
                    else {
                        this.getRequestData(request).then(req => {
                            resolve(req);
                        });
                    }
                }
            });
        });
    }

    //TRY
    static updateFriendRequest(reqId, req){
        return new Promise(function (resolve,reject){
            models.RequestM.findOne({id: reqId},(err,request) =>{
                if(err) resolve(404);
                else{
                    if (!request) resolve(404);
                    else {
                        models.RequestM.updateOne({id: reqId}, req, (err) => {
                            if (err) resolve(404);
                            else resolve(204);
                        });
                    }
                }
            });
        });
    }

    //Funciona
    static deleteFriendRequest(reqId){
        return new Promise((resolve,reject) =>{
            models.RequestM.findOne({id: reqId},(err,request) =>{
                if(err) resolve(404);
                else{
                    if (!request) resolve(404);
                    else {
                        models.RequestM.deleteOne({id: reqId}, (err) => {
                            if (err) resolve(404);
                            else resolve(204);
                        });
                    }
                }
            });
        });
    } 
}

module.exports = RequestService;