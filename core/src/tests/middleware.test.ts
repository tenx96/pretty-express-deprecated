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
describe("MIDDLEWARE ORDER tests", () => {
  before(() => {
    const server = new MyServer();
    app = server.getApp;
  });

  describe("Verify order of Check for class level and request level middlewares, required order :: `class level` --> `request level`", () => {
    it("get /middleware is marked by request by both controller and request middleware. It should last be marked by request middleware", () => {
      request
        .agent(app)
        .get("/middleware")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.ownProperty("message");
          expect(res.body.message).to.be.equal(
            "last changed by :request middleware"
          );
        });
    });

    it("get /middleware is marked ONLY BY controller middleware. It should last be marked by controller middleware" , () => {
        request
        .agent(app)
        .post("/middleware")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.ownProperty("message");
          expect(res.body.message).to.be.equal(
            "last changed by :controller middleware"
          );
        });
    })


    it("patch /middleware is marked  BY TWO request middleware. It should last be marked by request middleware2" , () => {
        request
        .agent(app)
        .patch("/middleware")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.ownProperty("message");
          expect(res.body.message).to.be.equal(
            "last changed by :request middleware2"
          );
        });
    })

  });
});
