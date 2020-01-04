const app = require('../src/index');
const models = require('../src/models/friendlist.model');
const request = require('supertest');

describe("Main page", () => {
    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("Welcome to express!"));
            });
        });
    });
});

describe("Friend list resource", () => {
    beforeAll(() => {
        const friendList = new models.FriendList({"userId": "5df9cfb41c9d44000047b035", "friends": ["5df9cfb41c9d44000047b036", "5df9cfb41c9d44000047b037"]});

        dbFindOne = jest.spyOn(models.FriendList, "findOne");
        dbFindOne.mockImplementation((query, callback) => {
            callback(null, friendList);
        });

        dbDeleteOne = jest.spyOn(models.FriendList, "deleteOne");
        dbDeleteOne.mockImplementation((query, callback) => {
            callback(null);
        });

        dbUpdateOne = jest.spyOn(models.FriendList, "updateOne");
        dbUpdateOne.mockImplementation((query, query2, callback) => {
            callback(null);
        });
    });

    describe("GET /friends", () => {
        it('Should return user 1 friend list', () => {
            return request(app).get('/users/5df9cfb41c9d44000047b035/friends').then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
            });
        });
    });

    describe("Delete /friends", () => {
        it('Should return status code 204', () => {
            return request(app).delete('/users/5df9cfb41c9d44000047b035/friends').then((response) => {
                expect(response.statusCode).toBe(204);
            });
        });
    });

    describe("Delete /friends/:id", () => {
        it('Should return status code 204', () => {
            return request(app).delete('/users/5df9cfb41c9d44000047b035/friends/5df9cfb41c9d44000047b036').then((response) => {
                expect(response.statusCode).toBe(204);
            });
        });

        /*it('Should return status code 404', () => {
            return request(app).delete('/users/5df9cfb41c9d44000047b035/friends/123').then((response) => {
                expect(response.statusCode).toBe(404);
            });
        });*/
    });
});