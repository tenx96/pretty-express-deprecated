import { describe } from "mocha";
import { Express } from "express";
import { MyServer } from "./TestServer";
import * as request from "supertest";
import { expect } from "chai";
import Sinon from "sinon";
import { assertHttpEndPoints } from "./helper";
import { HTTP_METHOD } from "../keys";
import { ValidateController } from "./controllers";

let spy: Sinon.SinonSpy;
let app: Express;
describe("VALIDATOR tests", () => {
  before(() => {
    const server = new MyServer();
    server.addControllersToServer([new ValidateController()])
    app = server.getApp;
  });

  describe("required schema, {email : email-string, password : string , name : optional, string}", () => {
    it("Request with optional parameter : name skipped , a valid email and password. SHOULD PASS!", () => {
      request
        .agent(app)
        .get("/validator")
        .send({ email: "test@gmail.com", password: "passwo3d" })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.ownProperty("message");
          expect(res.body).to.have.ownProperty("data");
          expect(res.body.data).to.have.keys(["email", "password"]);
          expect(res.body.data.email).to.be.equal("test@gmail.com");
          expect(res.body.data.password).to.be.equal("passwo3d");
        });
    });

    it("Request with  : name , a valid email and password. SHOULD PASS!", () => {
      request
        .agent(app)
        .get("/validator")
        .send({ email: "test@gmail.com", password: "passwo3d", name: "Tenx" })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.ownProperty("message");
          expect(res.body).to.have.ownProperty("data");
          expect(res.body.data).to.have.keys(["email", "password", "name"]);
          expect(res.body.data.email).to.be.equal("test@gmail.com");
          expect(res.body.data.password).to.be.equal("passwo3d");
          expect(res.body.data.name).to.be.equal("Tenx");
        });
    });

    it("Request with  invalid email. Should return a status 400!", () => {
      request
        .agent(app)
        .get("/validator")
        .send({ email: "test@@gmail.com", password: "passwo3d", name: "Tenx" })
        .expect("Content-Type", /json/)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
        });
    });

    it("Request with  EXTRA property on body : name , a valid email and password. Extra data will be accepted without whitelist", () => {
      request
        .agent(app)
        .get("/validator")
        .send({
          email: "test@gmail.com",
          password: "passwo3d",
          name: "Tenx",
          extra: "x",
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.ownProperty("message");
          expect(res.body).to.have.ownProperty("data");
          expect(res.body.data).to.have.keys([
            "email",
            "password",
            "name",
            "extra",
          ]);
        });
    });

    it("Request with  EXTRA property on body : name , a valid email and password. Extra data will be removed due to whitelist", () => {
      request
        .agent(app)
        .post("/validator")
        .send({
          email: "test@gmail.com",
          password: "passwo3d",
          name: "Tenx",
          extra: "x",
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.ownProperty("message");
          expect(res.body).to.have.ownProperty("data");
          expect(res.body.data).to.have.keys(["email", "password", "name"]);
        });
    });
  });


  describe("Response Validation Tests" , () => {
    it("function returns a valid object of proper type. should pass with 200 with prop : name,email", (done) => {
      request
        .agent(app)
        .get("/validator/validate-res-1")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err);
          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.keys(["name" , "email"]);
          done()
        });
    });


    it("function returns a  object of proper type but with extra property. should pass with 200 with prop `extra1` & `extra2` removed from body", (done) => {
      request
        .agent(app)
        .get("/validator/validate-res-2")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err);
          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.keys(["name" , "email"]);
          expect(res.body).to.not.have.keys(["extra1" , "extra2"]);
          done()
        });
    });


    it("function returns a  invalid object. Should throw error", (done) => {
      request
        .agent(app)
        .get("/validator/validate-res-3")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done();
  
          done(new Error("Test should fail. But Passed!"))
        });
    });


    it("An optional prop is passed. prop `address` . It should be present in body", (done) => {
      request
        .agent(app)
        .get("/validator/validate-res-4")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err);
          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.keys(["name" , "email" , "address"]);
          done()
        });
    });

  })


  describe("Response Validation Tests returned as HttpResponse" , () => {
    it("function returns a valid object of proper type. should pass with 200 with prop : name,email", (done) => {
      request
        .agent(app)
        .get("/validator/validate-res-5")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err);
          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.keys(["name" , "email"]);
          done()
        });
    });


    it("function returns a  object of proper type but with extra property. should pass with 200 with prop `extra1` & `extra2` removed from body", (done) => {
      request
        .agent(app)
        .get("/validator/validate-res-6")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err);
          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.keys(["name" , "email"]);
          expect(res.body).to.not.have.keys(["extra1" , "extra2"]);
          done()
        });
    });


    it("function returns a  invalid object. Should throw error", (done) => {
      request
        .agent(app)
        .get("/validator/validate-res-7")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done();
  
          done(new Error("Test should fail. But Passed!"))
        });
    });


    it("An optional prop is passed. prop `address` . It should be present in body", (done) => {
      request
        .agent(app)
        .post("/validator/validate-res-8")
        .expect("Content-Type", /json/)
        .expect(201)
        .end((err, res) => {
          if (err) throw done(err);
          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.keys(["name" , "email" , "address"]);
          done()
        });
    });

  })

});
