const RequestService = require("../services/requestService.js");
let express = require('express');
let router = express.Router();

var basePath = '/api/v1';

//Get the requests from an user
router.get(basePath + '/users/:id/requests', (req, res) => {
    RequestService.getRequests(req.params.id,req.query.received, req.userId).then(data => {
        res.send(data);
    }).catch(err => {
        res.sendStatus(err);
    });
});

//Create a request
router.post(basePath + '/users/:id/requests', (req, res) => {
    RequestService.createRequest(req.body, req.userId, req.query.noemail).then(data => {
        res.sendStatus(data);
    });
});

//Accept a request
router.get(basePath + '/users/:id/requests/:reqId/accept', (req, res) => {
    RequestService.acceptRequest(req.params.reqId, req.userId).then(data => {
        res.sendStatus(data);
    });
});

//Delete All the requests
router.delete(basePath + '/users/:id/requests', (req,res)=>{
    RequestService.deleteAllRequests(req.params.id, req.userId).then(data => {
        res.sendStatus(data);
    });
});

//Get one specific request
router.get(basePath + '/users/:id/requests/:reqId', (req, res) => {
    RequestService.getFriendRequest(req.params.reqId, req.userId).then(data => {
        res.send(data);
    }).catch(err => {
        res.sendStatus(err);
    });
});

//update a request
router.put(basePath + '/users/:id/requests/:reqId',(req,res) =>{
    RequestService.updateFriendRequest(req.params.reqId, req.body, req.userId).then(data =>{
        res.sendStatus(data);
    });
});

//Delete a friend request
router.delete(basePath + '/users/:id/requests/:reqId',(req,res)=>{
    RequestService.deleteFriendRequest(req.params.reqId, req.userId).then(data =>{
        res.sendStatus(data);
    });
});

module.exports = router;