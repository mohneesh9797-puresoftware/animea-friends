let mongoose = require('mongoose');

const SERVER = 'localhost:27017';
const DATABASE = 'friends';
const OPTIONS = 'retryWrites=true&w=majority';

function connect() {
    mongoose.connect(`mongodb+srv://animea:animea@animea-friends-t2dsy.mongodb.net/test?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});
}

module.exports.connect = connect;