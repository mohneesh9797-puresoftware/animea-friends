const app = require('../src/index');
const models = require('../src/models/request.model');
const request = require('supertest');


//Test
describe("HW test", () =>{

    it("Testing test", ()=>{
        const a = 2;
        const b = 3;
        const sum = a + b;

        expect(sum).toBe(5);
    });
});

describe("Request resource",()=>{
    beforeAll(()=>{                     //Creo que hay que crearlas como alicia, con su id seteado. En postman ->  "id": xxx
        const request1 = new models.RequestM({"userId":5, "friendId":1, "message":"Solicitud 1", "id":"1"});
        const request2 = new models.RequestM({"userId":5, "friendId":2, "message":"Solicitud 2", "id":"2"});
        const request3 = new models.RequestM({"userId":5, "friendId":3, "message":"Solicitud 3", "id":"3"});
    

        dbFindOne = jest.spyOn(models.RequestM, "findOne");
        dbFindOne.mockImplementation((query, callback) =>{
            callback(null, request1);
        });

        dbRemove = jest.spyOn(models.RequestM, "remove");
        dbRemove.mockImplementation((query, callback) =>{
            callback(null);
        });

        dbUpdateOne = jest.spyOn(models.RequestM, "updateOne");
        dbUpdateOne.mockImplementation((query, query2, callback) =>{
            callback(null);
        });
    });

    //test Get todas las request de un user
    describe("GET /requests", () => {
        it('Should return the user 5 requests', () => {
            return request(app).get('/users/5/requests').then((response) =>{
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(4);
            });
        }, 6789);
    }); 

    //test Post una request
    describe("POST /request", ()=> {
        const request4 = {"userId":5, "friendId":4, "message":"Solicitud 4", "id":"4"};
        let dbInsert;

        beforeEach(() => {
            dbInsert = jest.spyOn(request4, "create");
        });

        it('should add a new request if everything is fine', () =>{
            dbInsert.mockImplementation((c,callback)=>{
                callback(false);
            });
            
            return request(app).post('/users/5/requests').send(request4).then((response) =>{
                expect(response.statusCode).toBe(201);
                expect(dbInsert).toBeCalledWith(request4, expect.any(Function));
            });
        });

        it('should return 500 if there is a problem with db', () =>{
            dbInsert.mockImplementation((c,callback)=>{
                callback(true);
            });
            
            return request(app).post('/users/5/requests').send(request4).then((response) =>{
                expect(response.statusCode).toBe(500);
            });
        });
    })


    //test Delete todas las requests
    describe("DELETE /requests",() =>{
        it('Should return status code 204', () =>{
            return request(app).delete('/users/5/requests').then((response) => {
                expect(response.statusCode).toBe(204);
            });
        });
    });

    //test Get una request concreta  (200 si existe 404 si no)
    describe("GET /request/:id", () => {
        it('Should return the request', () =>{
            return request(app).get('/users/5/requests/1').then((response) =>{
                expect(response.statusCode).toBe(204);
            });
        });

        it('Should return status code 404', () =>{
            return request(app).get('/users/5/requests/99').then((response) =>{
                expect(response.statusCode).toBe(404);
            });
        });
    });

    //test Put una request      No se si en el const hay que añadir el id
    describe("PUT /requests/:id", () => {
        const modification = {"userId":5, "friendId":1, "message":"Modification", "id":"1"};

        it('Should modify the request if everything is fine', () => {
            dbInsert.mockImplementation((c, callback) => {
                callback(false);
            });

            return request(app).put('/users/5/requests/1').send(modification).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbInsert).toBeCalledWith(modification, expect.any(Function)); 
            });
        });

        it('Should return 500 if there is a problem with db',() => {
            dbInsert.mockImplementation((c, callback) => {
                callback(true);
            });

            return request(app).put('/users/5/requests/1').send(modification).then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });
    });

    //test Delete una request
    describe("Delete /requests/:id", () => {
        it('Should return status code 204', () => {
            return request(app).delete('users/5/requests/1').then((response) => {
                expect(response.statusCode).toBe(204);
            });
        });

        it('Should return status code 404', () => {
            return request(app).delete('users/5/requests/99').then((response) => {
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


