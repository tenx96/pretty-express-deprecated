import { after, describe, Done } from "mocha";
import { Express } from "express";
import { MyServer } from "./TestServer";
import * as request from "supertest";
import { expect } from "chai";
import Sinon from "sinon";
import { assertHttpEndPoints, getAllExpressRoutes } from "./helper";
import { HTTP_METHOD } from "../keys";

let spy: Sinon.SinonSpy;
let app: Express;
describe("HTTP Tests", () => {
  before(() => {
    const server = new MyServer();
    app = server.getApp;
    getAllExpressRoutes(app);
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

  it("verify data is passed to proper arguments", async () => {
    const res = await request
      .agent(app)
      .get("/api/params/myuserid/tenx")
      .send({ message: "something", name: "test" })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res).to.have.ownProperty("body");
    expect(res.body).to.have.ownProperty("message");
    expect(res.body).to.have.ownProperty("body");
    expect(res.body).to.have.ownProperty("params");
    expect(res.body.body).to.have.keys(["message", "name"]);
    expect(res.body.params).to.have.keys(["id", "name"]);
  });
});
