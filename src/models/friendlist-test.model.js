let mongoose = require('mongoose');

let friendListTestSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    friends: [mongoose.Schema.Types.ObjectId]
}, {collection: 'friends-test'});

var FriendListTest = mongoose.model('FriendListTest', friendListTestSchema);

module.exports = {
    FriendListTest: FriendListTest
};