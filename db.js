let mongoose = require('mongoose');

const SERVER = 'localhost:27017';
const DATABASE = 'friends';
const OPTIONS = 'retryWrites=true&w=majority';

function connect() {
    mongoose.connect(`mongodb://${SERVER}/${DATABASE}?${OPTIONS}`, {useNewUrlParser: true, useUnifiedTopology: true});
}

module.exports.connect = connect;