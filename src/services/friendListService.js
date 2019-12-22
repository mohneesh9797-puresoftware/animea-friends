"use strict";

let models = require('../models/friendlist.model');
var Promise = require('bluebird');

class FriendListService {
    static getFriends(userId) {
        return new Promise((resolve, reject) => {
            models.FriendList.findOne({userId: userId}, (err, friends) => {
                if (!friends) resolve([]);
                else resolve(friends.friends);
            });
        });
    }

    static removeFriends(userId) {
        return new Promise((resolve, reject) => {
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
        });
    }

    static removeFriend(userId, friendId) {
        return new Promise((resolve, reject) => {
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
        });
    }
}

module.exports = FriendListService;