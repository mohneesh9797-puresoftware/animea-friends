const app = require('../src/index');
const models = require('../src/models/request.model');

describe("Hello world test", ()=>{
    it("Lets test", () => {
        const a = 2;
        const b = 3; 
        const sum = a+b;

        expect(sum).toBe(5);
    });
});

describe("Main page", () => {
    describe("GET /",()=> {
        it("Should return an HTML document", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("Welcome to express!"));                
            });
        });
    });
});

describe("Request list resource", () => {
    beforeAll(()=>{
        const request = new models.RequestM({"userId":5,"friendId":1,"message":"prueba3"});
            //supogo que necesito algo para usar esto 
        dbFindOne = jest
    })
})
