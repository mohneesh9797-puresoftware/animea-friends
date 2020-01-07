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

router.get(basePath + '/users/:id/friends/animes', (req, res) => {
    FriendListService.getFriendAnimes(req.params.id, req.userId, req.headers['x-access-token']).then(data => {
        res.send(data);
    }).catch(err => {
        res.sendStatus(err);
    });
});

module.exports = router;