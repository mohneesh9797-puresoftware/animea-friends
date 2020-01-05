"use strict";

let models = require('../models/friendlist.model');
var Promise = require('bluebird');
var rp = require('request-promise');

class FriendListService {
    static getFriends(userId) {
        return new Promise((resolve, reject) => {
            rp({
                url: 'https://185.176.5.147:7400/profile/api/profile/' + userId,
                insecure: true,
                rejectUnauthorized: false
            }).then(() => {
                models.FriendList.findOne({userId: userId}, (err, friends) => {
                    if (!friends) resolve([]);
                    else {
                        var retFriends = [];
                        var promises = [];
                        friends.friends.forEach(friend => {
                            promises.push(new Promise((resolve, reject) => {
                                rp({
                                    url: 'https://185.176.5.147:7400/profile/api/profile/' + friend,
                                    insecure: true,
                                    rejectUnauthorized: false
                                }).then((retFr) => {
                                    retFriends.push(JSON.parse(retFr));
                                    resolve();
                                });
                            }));
                        });
                        Promise.all(promises).then(() => {
                            resolve(retFriends);
                        });
                    };
                });
            }).catch(() => {
                reject(404);
            });
        });
    }

    static removeFriends(userId) {
        return new Promise((resolve, reject) => {
            rp({
                url: 'https://185.176.5.147:7400/profile/api/profile/' + userId,
                insecure: true,
                rejectUnauthorized: false
            }).then(() => {
                models.FriendList.findOne({userId: userId}, (err, friends) => {
                    if (!friends) resolve(204);
                    else {
                        models.FriendList.deleteOne({userId: userId}, (err) => {
                            var promises = [];
                            friends.friends.forEach(friend => {
                                return this.removeFriend(friend, userId);
                            });
                            Promise.all(promises).then(() => {
                                resolve(204);
                            });
                        });
                    }
                });
            }).catch(() => {
                resolve(404);
            });
        });
    }

    static removeFriend(userId, friendId) {
        return new Promise((resolve, reject) => {
            rp({
                url: 'https://185.176.5.147:7400/profile/api/profile/' + userId,
                insecure: true,
                rejectUnauthorized: false
            }).then(() => {
                rp({
                    url: 'https://185.176.5.147:7400/profile/api/profile/' + friendId,
                    insecure: true,
                    rejectUnauthorized: false
                }).then(() => {
                    models.FriendList.findOne({userId: userId}, (err, friends) => {
                        if (!friends || !friends.friends.includes(friendId)) resolve(404);
                        else  {
                            var friendIndex = friends.friends.indexOf(friendId);
                            var friendsCopy = friends.friends;
                            friendsCopy.splice(friendIndex, 1);
                            models.FriendList.updateOne({userId: userId}, {friends: friendsCopy}, (err) => {
                                models.FriendList.findOne({userId: friendId}, (err, friends2) => {
                                    var friendIndex2 = friends2.friends.indexOf(userId);
                                    var friendsCopy2 = friends2.friends;
                                    friendsCopy2.splice(friendIndex2, 1);
                                    models.FriendList.updateOne({userId: friendId}, {friends: friendsCopy2}, (err) => {
                                        resolve(204);
                                    });
                                });
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
}

module.exports = FriendListService;