const FriendListService = require("../services/friendListService.js");
let express = require('express');
let router = express.Router();

// Gets anime list
// GET localhost:3000/customer
router.get('/users/:id/friends', (req, res) => {
    res.send(FriendListService.getFriends());
});

module.exports = router;