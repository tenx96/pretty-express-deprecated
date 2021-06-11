import { after, describe, Done } from "mocha";
import { Express } from "express";
import { MyServer } from "./TestServer";
import * as request from "supertest";
import { expect } from "chai";
import Sinon from "sinon";
import { assertHttpEndPoints, getAllExpressRoutes } from "./helper";
import { HTTP_METHOD } from "../keys";
import { TestController } from "./controllers";

let spy: Sinon.SinonSpy;
let app: Express;
describe("HTTP Tests", () => {
  before(() => {
    const server = new MyServer();
    server.addControllersToServer([new TestController()])
    app = server.getApp;
    // getAllExpressRoutes(app);
  });

  it("Ping all available methods and check if it returns a 200 response", async () => {
    Object.values(HTTP_METHOD)
      .filter((r) => HTTP_METHOD.ALL)
      .forEach(async (key) => {
        let dat = await assertHttpEndPoints(
          key,
          "/api",
          { message: "hello!" },
          200,
          app
        );
      });
  });

  // add checks for @all decorator on /api/all

  it("Check @all route is accepting all routes", function (done) {
    ["get", "put", "post", "patch", "delete"].forEach(async () => {
      let agent: any = request.agent;
      try {
        const res = await agent(app)
          .get("/api/all")
          .expect(200)
          .expect("Content-Type", /json/);
     
        expect(res).to.have.property("body");
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("method");
        expect(res.body.method).to.have.be.equal(HTTP_METHOD.ALL);
      } catch (err) {
       return done(err);
      }
    });

   return done();
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




  it("verify query data is evaluated", async () => {
    const res = await request
      .agent(app)
      .get("/api/query?name=tenx&job=sde")
      .send({ message: "something", name: "test" })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res).to.have.ownProperty("body");
    expect(res.body).to.have.ownProperty("message");
    expect(res.body).to.have.ownProperty("query");
    expect(res.body.query).to.have.keys(["name", "job"]);
    expect(res.body.query.name).to.be.equal("tenx")
    expect(res.body.query.job).to.be.equal("sde")
   
  });
});
