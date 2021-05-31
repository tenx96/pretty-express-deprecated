import { describe } from "mocha";
import { Express } from "express";
import { MyServer } from "./TestServer";
import * as request from "supertest";
import { expect } from "chai";
import Sinon from "sinon";
import { assertHttpEndPoints } from "./helper";
import { HTTP_METHOD } from "../keys";

let spy: Sinon.SinonSpy;
let app: Express;
describe("VALIDATOR tests", () => {
  before(() => {
    const server = new MyServer();
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
});
