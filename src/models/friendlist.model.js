let mongoose = require('mongoose');

let friendListSchema = new mongoose.Schema({
    userId: Number,
    friends: [Number]
});

var FriendList = mongoose.model('FriendList', friendListSchema);

module.exports = {
    FriendList: FriendList
};