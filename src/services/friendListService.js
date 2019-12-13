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
}

module.exports = FriendListService;