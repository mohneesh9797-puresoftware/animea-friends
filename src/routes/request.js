const RequestService = require("../services/requestService.js");
let express = require('express');
let router = express.Router();

router.get('/users/:id/requests', (req, res) => {
    RequestService.getRequests(req.params.id).then(data => {
        res.send(data);
    });
});

router.post('/users/:id/requests', (req, res) => {
    RequestService.createRequest(req.body).then(data => {
        res.sendStatus(data);
    });
});

router.get('/users/:id/requests/:reqId/accept', (req, res) => {
    RequestService.acceptRequest(req.params.reqId).then(data => {
        res.sendStatus(data);
    });
});

module.exports = router;