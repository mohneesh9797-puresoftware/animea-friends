const FriendListService = require("../services/friendListService.js");
let express = require('express');
let router = express.Router();
let models = require('../models/friendlist.model');

router.get('/users/:id/friends', (req, res) => {
    FriendListService.getFriends(req.params.id).then(data => {
        res.send(data);
    });
});

module.exports = router;