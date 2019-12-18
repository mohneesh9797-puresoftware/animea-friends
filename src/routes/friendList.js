const FriendListService = require("../services/friendListService.js");
let express = require('express');
let router = express.Router();

router.get('/users/:id/friends', (req, res) => {
    FriendListService.getFriends(req.params.id).then(data => {
        res.send(data);
    });
});

router.delete('/users/:id/friends', (req, res) => {
    FriendListService.removeFriends(req.params.id).then(data => {
        res.sendStatus(data);
    });
});

router.delete('/users/:id/friends/:friendId', (req, res) => {
    FriendListService.removeFriend(req.params.id, req.params.friendId).then(data => {
        res.sendStatus(data);
    });
});

module.exports = router;