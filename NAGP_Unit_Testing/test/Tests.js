let chai =require("chai");
let chaiHttp =require("chai-http");
let server = require("../server");
let expect= chai.expect;
let unittest = require("../db/CRUDoperations");

chai.use(chaiHttp);
chai.should();

describe('Application Test ',()=>{
    describe("Get User by ID", ()=> {
       it("testing the DB Methods",(done)=>{
            let userById=unittest.getUserByID("1");
            userById.should.be.an('object');
            done();
        })
    })

    describe("Get Company by ID", ()=> {
        it("testing the DB Methods",(done)=>{
           let companyById=unittest.getCompanyByID("C1");
           companyById.should.be.an('object');
           done();
        })
    })

    describe("Increment User Balance", ()=> {
        it("testing the DB Methods",(done)=>{
           let user=unittest.addUserFund("1",100);
           user.should.be.an('object');
           done();
         })
    })

    describe("Decrement User Balance", ()=> {
        it("testing the DB Methods",(done)=>{
       let user=unittest.deductUserFund("1",100);
       user.should.be.an('object');
       done();
        })
    })

    describe("Add Company to User", ()=> {
        it("testing the DB Methods",(done)=>{
       let isSuccess=unittest.addCompanyToUser("1",'C1');
       isSuccess.should.be.an('object');
       done();
        })
    })

    describe("Delete Company from User", ()=> {
       it("testing the DB Methods",(done)=>{
       let isSuccess=unittest.deletCompanyFromUser("1",'C5');
       isSuccess.should.be.an('object');
       done();
        })
    })

    describe("Get Price of a company", ()=> {
        it("testing the DB Methods",(done)=>{
        let isSuccess=unittest.getFundByCompanyName("C1");
        isSuccess.should.be.an('object');
        done();
         })
     })

     describe("Chcek if user has company to sell ", ()=> {
        it("testing the DB Methods",(done)=>{
        let isSuccess=unittest.getUserCompanyByID("C1");
        isSuccess.should.be.an('object');
        done();
         })
     })

//Server is UP and Running 
//1. Check server is UP and Running.
describe("Check Server is UP adn Running",() => {
    it("Base url is hit",(done) => {
        chai.request(server)
        .get("/")
        .end((err, res) => {
            res.should.have.status(200);
        done();
        })
    });
})

//Test Add Fund API
//2. : Postive case: Adding Fund to API
describe("Adding Funds to the User",() => {
    it("Fund should be added to the user",(done) => {
        chai.request(server)
        .post("/addFund")
        .send({
            "userID": '1', 
            "fund": '100'
            })
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('user');
            res.body.should.have.property('user').eq(1);
        done();
        })
    });
})

//3. : Negative case: Adding negative Fund to User
describe("Adding Negative Fund to user",() => {
    it("Fund should not be accepted since its negative",(done) => {
        chai.request(server)
        .post("/addFund")
        .send({
            "userID": '1', 
            "fund": '-100'
            })
        .end((err, res) => {
            res.should.have.status(400);
        done();
        })
    });
})

//4. : Negative case: Sending wrong parameter "UID" to API
describe("Request has incorrect User id ",() => {
    it("Request has incorrect parameters",(done) => {
        chai.request(server)
        .post("/addFund")
        .send({
            "uID": '1', 
            "fund": '100'
            })
        .end((err, res) => {
            res.should.have.status(400);
        done();
        })
    });
})

//5. : Negative case: Send Non Existent User ID 
describe("Request has incorrect Parameter:Fund ",() => {
    it("Request has incorrect parameters",(done) => {
        chai.request(server)
        .post("/addFund")
        .send({
            "userID": '100', 
            "fund": '100'
            })
        .end((err, res) => {
            res.should.have.status(400);
        done();
        })
    });
})


//Test 
//6. :  Buying Equity Test Cases
describe("Buying an equity:Positive case",() => {
    it("Buying an equity",(done) => {
        chai.request(server)
        .post("/buyEquity")
        .send({
            "userID": '1', 
            "companyName": 'C1'
            })
        .end((err, res) => {
            res.should.have.status(200);
        done();
        })
    });
})

//7. : Negative case: Given User ID does not exist
describe("Buy Equity:- User ID does not exist.",() => {
    it("Buying an equity",(done) => {
        chai.request(server)
        .post("/buyEquity")
        .send({
            "userID": '100', 
            "companyName": 'C2'
            })
        .end((err, res) => {
            res.should.have.status(400);
        done();
        })
    });
})


//8. : Negative case: Company Name does not exist.
describe("Buy Equity:- Company ID does not exist.",() => {
    it("Buying an equity",(done) => {
        chai.request(server)
        .post("/buyEquity")
        .send({
            "userID": '1', 
            "companyName": 'C11'
            })
        .end((err, res) => {
            res.should.have.status(400);
        done();
        })
    });
})

describe("Buy Equity:- Company ID does not exist.",() => {
    it("Buying an equity",(done) => {
        chai.request(server)
        .post("/buyEquity")
        .send({
            "userID": '1', 
            "companName": 'C11'
            })
        .end((err, res) => {
            res.should.have.status(400);
        done();
        })
    });
})

//9. : Negative Case: User does not have required balance.
describe("Buy Equity:- User does not have required Funds.",() => {
    it("Buying an equity",(done) => {
        chai.request(server)
        .post("/buyEquity")
        .send({
            "userID": '1', 
            "companyName": 'C10'
            })
        .end((err, res) => {
            res.should.have.status(400);
        done();
        })
    });
})


//10. : Sell Equity-Test Cases
describe("Sell Equity:- Positive case.",() => {
    it("Selling an equity",(done) => {
        chai.request(server)
        .post("/sellEquity")
        .send({
            "userID": '1', 
            "companyName": 'C2'
            })
        .end((err, res) => {
            res.should.have.status(200);
        done();
        })
    });
})

//11. : Sell Equity-Test Cases
describe("Sell Equity:- Sending wrong User ID parameter.",() => {
    it("Selling an equity",(done) => {
        chai.request(server)
        .post("/sellEquity")
        .send({
            "uID": '1', 
            "companyName": 'C1'
            })
        .end((err, res) => {
            res.should.have.status(400);
        done();
        })
    });
})


//12. : Sell Equity-Test Cases
describe("Sell Equity:- Sending non existent UID  ",() => {
    it("Selling an equity",(done) => {
        chai.request(server)
        .post("/sellEquity")
        .send({
            "userID": '100', 
            "companyName": 'C1'
            })
        .end((err, res) => {
            res.should.have.status(400);
        done();
        })
    });
})

//13. : Sell Equity-Test Cases
describe("Sell Equity:- selling what user does not have.",() => {
    it("Selling an equity",(done) => {
        chai.request(server)
        .post("/sellEquity")
        .send({
            "userID": '1', 
            "companyName": 'C6'
            })
        .end((err, res) => {
            res.should.have.status(400);
        done();
        })
    });
})


})