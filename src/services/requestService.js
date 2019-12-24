"use strict";

let models = require('../models/request.model');
let friendModels = require('../models/friendlist.model');
var Promise = require('bluebird');

class RequestService {
    static getRequests(userId) {
        return new Promise((resolve, reject) => {
            models.RequestM.find({userId: userId}, (err, requests) => {
                if (err) resolve(404);
                else resolve(requests);
            });
        });
    }
    
    static createRequest(req) {
        return new Promise((resolve, reject) => {
            models.RequestM.findOne({userId: req.userId, friendId: req.friendId}, (err, res) => {
                if (res) resolve(400);
                else {
                    friendModels.FriendList.findOne({userId: req.userId}, (err, friends) => {
                        if (!friends || !friends.friends.includes(req.friendId)) {
                            req.id = Math.round(Math.random() * 1000);
                            models.RequestM.create(req, (err) => {
                                console.log(req);
                                resolve(201);
                            });
                        } else {
                            resolve(400);
                        }
                    });
                }
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

    //check
    static deleteAllRequests(userId){
        return new Promise((resolve,reject)=>{
            models.RequestM.remove({userId: userId},(err)=>{
                if(err) resolve(404)
                else resolve(204);
            });
        });
    }

    //TODO 
    static getFriendRequest(userId,requestId){
        return new Promise((resolve,reject) =>{
            models.RequestM.findOne({userId: userId, reqId: requestId},(err,request) =>{
                if(err) resolve(404)
                else{
                    if (!request) resolve(404)
                    else resolve(request)
                }
            });
        })
    }

    //TRY
    static updateFriendRequest(reqId){
        return new Promise(function (resolve,reject){
            models.RequestM.update({
                'request_id': reqId 
            }, reqId, function(){
                resolve();
            })
        })
    }

    //TRY  
    static deleteFriendRequest(userId,reqId){
        return new Promise((resolve,reject) =>{
            models.RequestM.findOne({userId: userId}, (err,request) => {
                if(!request || err) resolve(404);
                else {
                    models.RequestM.remove({reqId: reqId},(err)=>{
                        if(err) resolve(404)
                        else resolve(204)
                    })
                }
            });
        });
    } 
}

module.exports = RequestService;