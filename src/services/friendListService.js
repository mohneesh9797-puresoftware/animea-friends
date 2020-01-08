"use strict";

let models = require('../models/friendlist.model');
var Promise = require('bluebird');
var rp = require('request-promise');

class FriendListService {
    static getFriends(userId, logged) {
        return new Promise((resolve, reject) => {
            rp({
                url: 'https://animea-gateway.herokuapp.com/profile/api/profile/' + userId
            }).then(() => {
                models.FriendList.findOne({userId: userId}, (err, friends) => {
                    if (!friends) resolve([]);
                    else {
                        var retFriends = [];
                        var promises = [];
                        friends.friends.forEach(friend => {
                            promises.push(new Promise((resolve, reject) => {
                                rp({
                                    url: 'https://animea-gateway.herokuapp.com/profile/api/profile/' + friend
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

    static removeFriends(userId, logged) {
        return new Promise((resolve, reject) => {
            if (userId !== logged) resolve(403);
            else {
                rp({
                    url: 'https://animea-gateway.herokuapp.com/profile/api/profile/' + userId
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
            }
        });
    }

    static removeFriend(userId, friendId, logged) {
        return new Promise((resolve, reject) => {
            if (userId !== logged) resolve(403);
            else {
                rp({
                    url: 'https://animea-gateway.herokuapp.com/profile/api/profile/' + userId
                }).then(() => {
                    rp({
                        url: 'https://animea-gateway.herokuapp.com/profile/api/profile/' + friendId
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
            }
        });
    }

    static getFriendAnimes(userId, logged, token) {
        return new Promise((resolve, reject) => {
            if (userId !== logged) reject(403);
            else {
                models.FriendList.findOne({userId: userId}, (err, friends) => {
                    if (!friends) reject(404);
                    else {
                        var promises = [];
                        var animes = [];
                        friends.friends.forEach(friend => {
                            promises.push(new Promise((resolve, reject) => {
                                rp({
                                    url: 'https://animea-gateway.herokuapp.com/animes/api/v1/user/' + userId + '/animes',
                                    headers: {
                                        'x-access-token': token,
                                        'x-user-id': userId
                                    }
                                }).then(franimes => {
                                    animes.concat(JSON.parse(franimes));
                                    resolve();
                                });
                            }));
                        });
                        Promise.all(promises).then(() => {
                            var uniqueAnimes = animes.filter(function(item, pos, self) {
                                return self.indexOf(item) == pos;
                            });
                            resolve(uniqueAnimes);
                        });
                    }
                });
            }
        });
    }
}

module.exports = FriendListService;