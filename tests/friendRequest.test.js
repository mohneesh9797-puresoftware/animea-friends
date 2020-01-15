const app = require('../src/index');
const fmodels = require('../src/models/friendlist.model');
const rmodels = require('../src/models/request.model');
const request = require('supertest');

var basePath = '/api/v1';

jest.setTimeout(60000);

//Test
describe("HW test", () =>{

    it("Testing test", ()=>{
        const a = 2;
        const b = 3;
        const sum = a + b;

        expect(sum).toBe(5);
    });
});

describe("Friend list resource", () => {
    beforeAll(() => {
        const friendList = new fmodels.FriendList({"userId": "5e145acd5591df48f0316f02", "friends": ["5e145b225591df48f0316f03", "5e145b3c5591df48f0316f05"]});

        dbFindOne = jest.spyOn(fmodels.FriendList, "findOne");
        dbFindOne.mockImplementation((query, callback) => {
            callback(null, friendList);
        });

        dbDeleteOne = jest.spyOn(fmodels.FriendList, "deleteOne");
        dbDeleteOne.mockImplementation((query, callback) => {
            callback(null);
        });

        dbUpdateOne = jest.spyOn(fmodels.FriendList, "updateOne");
        dbUpdateOne.mockImplementation((query, query2, callback) => {
            callback(null);
        });
    });

    describe("GET /friends", () => {
        it('Should return user 1 friend list', () => {
            return request(app).get(basePath + '/users/5e145acd5591df48f0316f02/friends').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
            });
        });
    });

    describe("GET /friends/animes", () => {
        it('Should return user 1 friends animes', () => {
            return request(app).get(basePath + '/users/5e145acd5591df48f0316f02/friends/animes').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).then((response) => {
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe("Delete /friends", () => {
        it('Should return status code 204', () => {
            return request(app).delete(basePath + '/users/5e145acd5591df48f0316f02/friends').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).then((response) => {
                expect(response.statusCode).toBe(204);
            });
        });
    });

    describe("Delete /friends/:id", () => {
        it('Should return status code 204', () => {
            return request(app).delete(basePath + '/users/5e145acd5591df48f0316f02/friends/5e145b225591df48f0316f03').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).then((response) => {
                expect(response.statusCode).toBe(204);
            });
        });
    });
});

describe("Request resource",()=>{
    beforeAll(()=>{                     //Creo que hay que crearlas como alicia, con su id seteado. En postman ->  "id": xxx
        const request1 = new rmodels.RequestM({"userId":"5e145acd5591df48f0316f02", "friendId":"5e145b225591df48f0316f03", "message":"Solicitud 1", "id":"1"});
        const request2 = new rmodels.RequestM({"userId":"5e145acd5591df48f0316f02", "friendId":2, "message":"Solicitud 2", "id":"2"});
        const request3 = new rmodels.RequestM({"userId":"5e145acd5591df48f0316f02", "friendId":3, "message":"Solicitud 3", "id":"3"});
    

        dbFind = jest.spyOn(rmodels.RequestM, "find");
        dbFind.mockImplementation((query, callback) =>{
            callback(null, [request1]);
        });
        
        dbFindOne = jest.spyOn(rmodels.RequestM, "findOne");
        dbFindOne.mockImplementation((query, callback) =>{
            callback(null, request1);
        });

        dbDeleteOne = jest.spyOn(rmodels.RequestM, "deleteOne");
        dbDeleteOne.mockImplementation((query, callback) =>{
            callback(null);
        });

        dbUpdateOne = jest.spyOn(rmodels.RequestM, "updateOne");
        dbUpdateOne.mockImplementation((query, query2, callback) =>{
            callback(null);
        });
    });

    //test Get todas las request de un user
    describe("GET /requests", () => {
        it('Should return the user 5 requests', () => {
            return request(app).get(basePath + '/users/5e145acd5591df48f0316f02/requests').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).then((response) =>{
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(1);
            });
        });
    }); 

    //test Post una request
    describe("POST /requests", ()=> {
        const request4 = {"userId":"5e145acd5591df48f0316f02", "friendId":"5e145b3c5591df48f0316f05", "message":"Solicitud 4", "id":"4"};
        dbFindOne = jest.spyOn(rmodels.RequestM, "findOne");
        dbInsert = jest.spyOn(rmodels.RequestM, "create");

        it('should add a new request if everything is fine', () =>{
            dbFindOne.mockImplementation((query, callback) =>{
                callback(null, null);
            });
            dbInsert.mockImplementation((request4, callback)=>{
                callback(null);
            });
            
            return request(app).post(basePath + '/users/5e145acd5591df48f0316f02/requests?noemail=true').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).send(request4).then((response) =>{
                expect(response.statusCode).toBe(201);
            });
        });

        it('should return 400 if there is a problem with db', () =>{
            dbInsert.mockImplementation((c,callback)=>{
                callback(true);
            });
            
            return request(app).post(basePath + '/users/5e145acd5591df48f0316f02/requests?noemail=true').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).send(request4).then((response) =>{
                expect(response.statusCode).toBe(400);
            });
        });
    });

    //test Acepta una request
    describe("GET /requests/:id/accept", ()=> {
        it('should accept a request if everything is fine', () =>{
            const request1 = new rmodels.RequestM({"userId":"5e145acd5591df48f0316f02", "friendId":"5e145b225591df48f0316f03", "message":"Solicitud 1", "id":"1"});
            dbFindOne.mockImplementation((query, callback) =>{
                callback(null, request1);
            });
            
            return request(app).get(basePath + '/users/5e145acd5591df48f0316f02/requests/1/accept').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWIyMjU1OTFkZjQ4ZjAzMTZmMDMiLCJpYXQiOjE1MTYyMzkwMjJ9.Pk1IzS7GlHsL4eOnRBfj7cgIOrJz66kyJpIBI6fkQHY'}).then((response) =>{
                expect(response.statusCode).toBe(204);
            });
        });

        it('should return 403 if user has no permission', () =>{
            return request(app).get(basePath + '/users/5e145acd5591df48f0316f02/requests/1/accept').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).then((response) =>{
                expect(response.statusCode).toBe(403);
            });
        });

        it('should return 404 if there is no request', () =>{
            dbFindOne.mockImplementation((c,callback)=>{
                callback(null, null);
            });
            
            return request(app).get(basePath + '/users/5e145acd5591df48f0316f02/requests/1/accept').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWIyMjU1OTFkZjQ4ZjAzMTZmMDMiLCJpYXQiOjE1MTYyMzkwMjJ9.Pk1IzS7GlHsL4eOnRBfj7cgIOrJz66kyJpIBI6fkQHY'}).then((response) =>{
                expect(response.statusCode).toBe(404);
            });
        });
    })

    //test Delete todas las requests
    describe("DELETE /requests",() =>{
        it('Should return status code 204', () =>{
            return request(app).delete(basePath + '/users/5e145acd5591df48f0316f02/requests').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).then((response) => {
                expect(response.statusCode).toBe(204);
            });
        });
    });

    //test Get una request concreta  (200 si existe 404 si no)
    describe("GET /requests/:id", () => {
        it('Should return the request', () =>{
            const request1 = new rmodels.RequestM({"userId":"5e145acd5591df48f0316f02", "friendId":"5e145b225591df48f0316f03", "message":"Solicitud 1", "id":"1"});
            dbFindOne.mockImplementation((query, callback) =>{
                callback(null, request1);
            });

            return request(app).get(basePath + '/users/5e145acd5591df48f0316f02/requests/1').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).then((response) =>{
                expect(response.statusCode).toBe(200);
            });
        });

        it('Should return status code 404', () =>{
            dbFindOne.mockImplementation((query, callback) =>{
                callback(null, null);
            });

            return request(app).get(basePath + '/users/5e145acd5591df48f0316f02/requests/99').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).then((response) =>{
                expect(response.statusCode).toBe(404);
            });
        });
    });

    //test Put una request      No se si en el const hay que añadir el id
    describe("PUT /requests/:id", () => {
        const modification = {"userId":"5e145acd5591df48f0316f02", "friendId":"5e145b225591df48f0316f03", "message":"Modification", "id":"1"};

        it('Should modify the request if everything is fine', () => {
            const request1 = new rmodels.RequestM({"userId":"5e145acd5591df48f0316f02", "friendId":"5e145b225591df48f0316f03", "message":"Solicitud 1", "id":"1"});
            dbFindOne.mockImplementation((query, callback) =>{
                callback(null, request1);
            });

            return request(app).put(basePath + '/users/5e145acd5591df48f0316f02/requests/1').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).send(modification).then((response) => {
                expect(response.statusCode).toBe(204)
                expect(dbUpdateOne).toBeCalledWith({"id": "1"}, modification, expect.any(Function)); 
            });
        });

        it('Should return 404 if there is an error',() => {
            dbUpdateOne.mockImplementation((query, query2, callback) => {
                callback(true);
            });

            return request(app).put(basePath + '/users/5e145acd5591df48f0316f02/requests/1').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).send(modification).then((response) => {
                expect(response.statusCode).toBe(400);
            });
        });
    });

    //test Delete una request
    describe("Delete /requests/:id", () => {
        it('Should return status code 204', () => {
            return request(app).delete(basePath + '/users/5e145acd5591df48f0316f02/requests/1').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).then((response) => {
                expect(response.statusCode).toBe(204);
            });
        });

        it('Should return status code 404', () => {
            dbFindOne.mockImplementation((query, callback) =>{
                callback(null, null);
            });

            return request(app).delete(basePath + '/users/5e145acd5591df48f0316f02/requests/99').set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI1ZTE0NWFjZDU1OTFkZjQ4ZjAzMTZmMDIiLCJpYXQiOjE1MTYyMzkwMjJ9.RZ_kqF4AV8Ir3OToNiV9X8qr4zFL6ZJmoG6QNH4-gck'}).then((response) => {
                expect(response.statusCode).toBe(404);
            });
        });
    });

    /*
    //Cerrar conexión bd
    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    }); */
}); 


