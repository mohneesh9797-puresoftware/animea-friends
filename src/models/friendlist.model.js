let mongoose = require('mongoose');

let friendListSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    friends: [mongoose.Schema.Types.ObjectId]
}, {collection: 'friends'});

var FriendList = mongoose.model('FriendList', friendListSchema);

module.exports = {
    FriendList: FriendList
};