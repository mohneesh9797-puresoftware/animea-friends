"use strict";

let database = require('../../db');
let models = require('../models/friendlist.model');

var db = database.connection;

var findFriends = async function() {
    return await models.FriendList.find({});
}

class FriendListService {
    static getFriends() {
        var friends = findFriends();
        return {friends: "list"};
    }
}

module.exports = FriendListService;