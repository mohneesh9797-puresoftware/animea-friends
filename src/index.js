let express = require('express');

let app = express();
let cors = require('cors');
let friendListRoute = require('./routes/friendList');
let requestRoute = require('./routes/request');
let path = require('path');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let database = require('../db');
var jwt = require('jsonwebtoken');

database.connect();

app.use(bodyParser.json());
app.use(cors());

// Middleware to show logs of every call
app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next();
});

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) 
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, 'supersecret', function(err, decoded) {      
    if (err)
      return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
}

app.use(verifyToken)

app.use(friendListRoute);
app.use(requestRoute);

app.use(express.static('public'));

// Handler for 404 - Resource not found
app.use((req, res, next) => {
    res.status(404).send('We think you are lost!');
});

// Handler for error 500
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.sendFile(path.join(__dirname, '../public/500.html'));
});

const PORT = process.env.FRIENDS_PORT || 3003;

app.listen(PORT, () => console.info(`Server has started on port ${PORT}`));

module.exports = app;