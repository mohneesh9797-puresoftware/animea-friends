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

//TODO