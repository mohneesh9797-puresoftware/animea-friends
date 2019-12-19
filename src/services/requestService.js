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
    /*
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

    //TODO
    static deleteAllRequests(){
        return new Promise((resolve,reject) =>{
            models.deleteAllRequests({},()  => {
                resolve(202)})
        })
    }

    //TODO
    static getFriendRequest(req){
        
    }

    //TODO
    static updateFriendRequest(reqId)

    //TRY
    static deleteFriendRequest(reqId){
        return new Promise((resolve,reject) =>{
            models.remove({
                id: reqId
            }, function(err, docs){
                resolve(202);
            });
        });
    } */
}

module.exports = RequestService;