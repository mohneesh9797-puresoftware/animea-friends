const RequestTest = require('../src/models/*');
const mongoose = require('mongoose');
const db = require('../db');

describe('Friends DB connection', () => {
    beforeAll(() => {
        return db.connect();
    })

    it('inserts a request in db', (done) => {
        const request = new Request({"userId": 1, "friendId": 2, "message": "solicitud 1", "id": 12});
        request.save((err, request) => {
            expect(err).toBeNull();
            RequestTest.find({}, (err, requests) => {
                expect(requests.length).toEqual(1);
                done();
            });
        });
    });

    it('updates a request in db', (done) => {
        const userRequest = {user_id: 1, request_id: 12};
        const updatedRequest = {message: "Updated"};
        RequestTest.findOneAndUpdate(userRequest, updatedRequest, function () {
            RequestTest.find({}, (err, requests) => {
                expect(requests.length).toEqual(1);
                expect(requests[0].message).toEqual("Updated");
                done();
          });
        });
    });

    it('deletes a request from the db', (done) => {
        const userRequest = {user_id: 1, request_id: 12};
        RequestTest.findOneAndRemove(userRequest, (err) => {
            expect(err).toBeNull();
            RequestTest.find({}, (err, requests) => {
                expect(requests.length).toEqual(0);
                done();
            });
        });
    });

    afterAll((done) => {
        mongoose.connection.db.dropCollection('requests-test', () => {
            mongoose.connection.close(done);
        });
    });

})