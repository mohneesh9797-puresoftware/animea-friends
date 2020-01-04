let mongoose = require('mongoose');

let friendListSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    friends: [mongoose.Schema.Types.ObjectId]
});

var FriendList = mongoose.model('FriendList', friendListSchema);

module.exports = {
    FriendList: FriendList
};