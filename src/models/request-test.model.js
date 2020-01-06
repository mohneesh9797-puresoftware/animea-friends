let mongoose = require('mongoose');

let requestTestSchema = new mongoose.Schema({
    id: Number,
    userId: mongoose.Schema.Types.ObjectId,
    friendId: mongoose.Schema.Types.ObjectId,
    message: String
}, {collection: 'requests-test'});

var RequestTest = mongoose.model('RequestTest', requestTestSchema);

module.exports = {
    RequestTest: RequestTest
};