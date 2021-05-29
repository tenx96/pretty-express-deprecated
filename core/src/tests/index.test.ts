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
describe("test", () => {
  before(() => {
    const server = new MyServer();
    app = server.getApp;
  });

  it("Ping all available methods and check if it returns a 200 response", async () => {
    Object.values(HTTP_METHOD).forEach(async (key) => {
      let dat = await assertHttpEndPoints(
        key,
        "/api",
        { message: "hello!" },
        200,
        app
      );
    });
  });

  describe("Request body & param is passed to args marked with @requestBody, @requestParams", () => {
    it("verify data is passed to proper arguments", () => {
      request
        .agent(app)
        .get("/api/params/myuserid/tenx")
        .send({ message: "something", name: "test" })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.ownProperty("message");
          expect(res.body).to.have.ownProperty("body");
          expect(res.body).to.have.ownProperty("params");
          expect(res.body.body).to.have.keys(["message", "name"]);
          expect(res.body.params).to.have.keys(["id", "name"]);
        });
    });
  });
});
