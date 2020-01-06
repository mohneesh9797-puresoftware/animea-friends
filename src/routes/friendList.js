const FriendListService = require("../services/friendListService.js");
let express = require('express');
let router = express.Router();

var basePath = '/api/v1';

router.get(basePath + '/users/:id/friends', (req, res) => {
    FriendListService.getFriends(req.params.id, req.userId).then(data => {
        res.send(data);
    }).catch(err => {
        res.sendStatus(err);
    });
});

router.delete(basePath + '/users/:id/friends', (req, res) => {
    FriendListService.removeFriends(req.params.id, req.userId).then(data => {
        res.sendStatus(data);
    });
});

router.delete(basePath + '/users/:id/friends/:friendId', (req, res) => {
    FriendListService.removeFriend(req.params.id, req.params.friendId, req.userId).then(data => {
        res.sendStatus(data);
    });
});

module.exports = router;