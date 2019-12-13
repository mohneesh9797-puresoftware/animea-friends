let mongoose = require('mongoose');

let requestSchema = new mongoose.Schema({
    id: Number,
    userId: Number,
    friendId: Number,
    message: String
});

var RequestM = mongoose.model('Request', requestSchema);

module.exports = {
    RequestM: RequestM
};