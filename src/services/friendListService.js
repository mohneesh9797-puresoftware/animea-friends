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
            models.FriendList.remove({userId: userId}, (err) => {
                resolve(204);
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
                        resolve(204);
                    });
                }
            });
        });
    }
}

module.exports = FriendListService;