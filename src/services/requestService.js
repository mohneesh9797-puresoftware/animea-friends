"use strict";

let models = require('../models/request.model');
let friendModels = require('../models/friendlist.model');
var Promise = require('bluebird');

class RequestService {
    static getRequests(userId) {
        return new Promise((resolve, reject) => {
            models.RequestM.find({userId: userId}, (err, requests) => {
                resolve(requests);
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
                } else resolve(404)
            });
        });
    }

    //check
    static deleteAllRequests(userId){
        return new Promise((resolve,reject)=>{
            models.RequestM.remove({userId: userId},(err)=>{
                resolve(204);
            });
        });
    }

    //TODO falta el metodo de buscar el user
    static getFriendRequest(userId,requestId){
        return new Promise((resolve,reject) =>{
            models.RequestM.findOne({id: requestId},(err,req) =>{
                /*
                if(noExisteElUser){  <- metodo de get ususario 
                    reject(404);
                }    
                */
                if(err){
                    reject(404);
                }
                resolve(req);
            });
        }
        )
    }

    //TODO
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
            models.RequestM.findOne({userId: userId}, (err,requests) => {
                if(!requests || !requests.requests.includes(reqId)) resolve(404);
                else {
                    var reqIndex = requests.requests.indexOf(reqId);
                    var reqCopy = requests.requests;
                    reqCopy.splice(reqIndex, 1);
                    models.RequestM.updateOne({userId:userId},{requests: reqCopy}, (err)=> {
                        resolve(204);
                    });
                }
            });
        });
    } 
}

module.exports = RequestService;