const RequestTest = require('../src/models/request-test.model').RequestTest;
const FriendListTest = require('../src/models/friendlist-test.model').FriendListTest;
const mongoose = require('mongoose');
const db = require('../db');

describe('Friends DB connection', () => {
    beforeAll(() => {
        return db.connect();
    });

    it('inserts a friend list in db', (done) => {
        const friendlist = new FriendListTest({"userId": "5df9cfb41c9d44000047b035", "friends": ["5df9cfb41c9d44000047b036"]});
        friendlist.save((err, frlist) => {
            expect(err).toBeNull();
            FriendListTest.find({}, (err, frlists) => {
                expect(frlists.length).toEqual(1);
                done();
            });
        });
    });

    it('updates a friend list in db', (done) => {
        const frlist = {"userId": "5df9cfb41c9d44000047b035"};
        const updatedfrlist = {"userId": "5df9cfb41c9d44000047b035", "friends": ["5df9cfb41c9d44000047b037"]};
        FriendListTest.findOneAndUpdate(frlist, updatedfrlist, function () {
            FriendListTest.find({}, (err, frlists) => {
                expect(frlists.length).toEqual(1);
                expect(frlists[0].friends.length).toEqual(1);
                done();
          });
        });
    });

    it('deletes a friend list from the db', (done) => {
        const frlist = {"userId": "5df9cfb41c9d44000047b035"};
        FriendListTest.findOneAndRemove(frlist, (err) => {
            expect(err).toBeNull();
            FriendListTest.find({}, (err, frlists) => {
                expect(frlists.length).toEqual(0);
                done();
            });
        });
    });

    it('inserts a request in db', (done) => {
        const request = new RequestTest({"userId": "5df9cfb41c9d44000047b035", "friendId": "5df9cfb41c9d44000047b036", "message": "solicitud 1", "id": 12});
        request.save((err, request) => {
            expect(err).toBeNull();
            RequestTest.find({}, (err, requests) => {
                expect(requests.length).toEqual(1);
                done();
            });
        });
    });

    it('updates a request in db', (done) => {
        const userRequest = {"id": 12};
        const updatedRequest = {"userId": "5df9cfb41c9d44000047b035", "friendId": "5df9cfb41c9d44000047b036", "message": "Updated", "id": 12};
        RequestTest.findOneAndUpdate(userRequest, updatedRequest, function () {
            RequestTest.find({}, (err, requests) => {
                expect(requests.length).toEqual(1);
                expect(requests[0].message).toEqual("Updated");
                done();
          });
        });
    });

    it('deletes a request from the db', (done) => {
        const userRequest = {"id": 12};
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
            mongoose.connection.db.dropCollection('friends-test', () => {
                mongoose.connection.close(done);
            });
        });
    });

})