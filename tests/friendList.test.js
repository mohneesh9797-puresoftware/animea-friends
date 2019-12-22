const app = require('../src/index');
const models = require('../src/models/friendlist.model');
const request = require('supertest');

describe("Hello world tests", () => {

    it("Should do an stupid test", () => {
        const a = 5;
        const b = 3;
        const sum = a + b;

        expect(sum).toBe(8);
    });

});

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
        const friendList = new models.FriendList({"userId": 1, "friends": [2, 3, 4]});

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
            return request(app).get('/users/1/friends').then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(3);
            });
        });
    });

    describe("Delete /friends", () => {
        it('Should return status code 204', () => {
            return request(app).delete('/users/1/friends').then((response) => {
                expect(response.statusCode).toBe(204);
            });
        });
    });

    describe("Delete /friends/:id", () => {
        it('Should return status code 204', () => {
            return request(app).delete('/users/1/friends/2').then((response) => {
                expect(response.statusCode).toBe(204);
            });
        });

        it('Should return status code 404', () => {
            return request(app).delete('/users/1/friends/5').then((response) => {
                expect(response.statusCode).toBe(404);
            });
        });
    });

    /*describe('POST /contacts', () => {
        const contact = {name: "juan", phone: "6766"};
        let dbInsert;

        beforeEach(() => {
            dbInsert = jest.spyOn(Contact, "create");
        });

        it('Should add a new contact if everything is fine', () => {
            dbInsert.mockImplementation((c, callback) => {
                callback(false);
            });

            return request(app).post('/api/v1/contacts').send(contact).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbInsert).toBeCalledWith(contact, expect.any(Function));
            });
        });

        it('Should return 500 if there is a problem with the DB', () => {
            dbInsert.mockImplementation((c, callback) => {
                callback(true);
            });

            return request(app).post('/api/v1/contacts').send(contact).then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });
    });*/
});