import { describe } from "mocha";
import { Express } from "express";
import { MyServer } from "./TestServer";
import * as request from "supertest";
import { expect } from "chai";
import Sinon from "sinon";
import { assertHttpEndPoints } from "./helper";
import { HTTP_METHOD } from "../keys";
import { MyJwtAuthService } from "./auth.serv";
import { ParameterController } from "./controllers";

let spy: Sinon.SinonSpy;
let app: Express;
let token = "";
describe("Parameters order tests", () => {
  before(async () => {
    const server = new MyServer();
    const auth = new MyJwtAuthService();
    server.addAuthenticationStrategies([auth]);
    token = await auth.generateToken({
      email: "test@gmail.com",
      id: "123",
      role: "admin",
    });
    server.addControllersToServer([new ParameterController()]);
    app = server.getApp;
  });

  describe("Single decorated arguments", () => {
    it("Check if body parameter is correct", async () => {
      const res = await request
        .agent(app)
        .get("/parameter/body")
        .send({ email: "test@gmail.com", password: "pass" });

      expect(res.status).to.be.equal(200);
      expect(res.body).to.have.property("body");
      expect(res.body.body).to.have.keys(["email", "password"]);
      expect(res.body.body.email).to.be.equal("test@gmail.com");
      expect(res.body.body.password).to.be.equal("pass");
    });

    it("Check if parameter  is correct", async () => {
      const res = await request.agent(app).get("/parameter/params/1234");
      expect(res.status).to.be.equal(200);
      expect(res.body).to.have.property("params");
      expect(res.body.params).to.have.keys(["id"]);
      expect(res.body.params.id).to.be.equal("1234");
    });

    it("Check if query  is correct", async () => {
      const res = await request
        .agent(app)
        .get("/parameter/query?id=123&name=tenx");

      expect(res.status).to.be.equal(200);
      expect(res.body).to.have.property("query");
      expect(res.body.query).to.have.keys(["id", "name"]);
      expect(res.body.query.id).to.be.equal("123");
      expect(res.body.query.name).to.be.equal("tenx");
    });

    it("Check if authUser  is correct", async () => {
      const res = await request
        .agent(app)
        .get("/parameter/authUser")
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(res.status).to.be.equal(200);
      expect(res.body).to.have.property("authUser");
      expect(res.body.authUser).to.have.keys(["id", "role", "email", "iat"]);
      expect(res.body.authUser.id).to.be.equal("123");
      expect(res.body.authUser.role).to.be.equal("admin");
      expect(res.body.authUser.email).to.be.equal("test@gmail.com");
    });
  });

  describe("Two-Three Decorated arguments", () => {
    it("Check if param & authUser is correct", async () => {
      const res = await request
        .agent(app)
        .get("/parameter/params-authuser/123")
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(res.status).to.be.equal(200);
      expect(res.body).to.have.keys(["params", "authUser"]);
      expect(res.body.params).to.have.keys(["id"]);
      expect(res.body.authUser).to.have.keys(["id", "role", "email", "iat"]);
    });

    it("Check if param & authUser is correct , order => auth-params", async () => {
      const res = await request
        .agent(app)
        .get("/parameter/authuser-params/123")
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(res.status).to.be.equal(200);
      expect(res.body).to.have.keys(["params", "authUser"]);
      expect(res.body.params).to.have.keys(["id"]);
      expect(res.body.authUser).to.have.keys(["id", "role", "email", "iat"]);
    });

    it("Check if param & authUser & query is correct, order : auth-params-query", async () => {
      const res = await request
        .agent(app)
        .get("/parameter/authuser-params-query/123?name=tenx")
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(res.status).to.be.equal(200);
      expect(res.body).to.have.keys(["params", "authUser", "query"]);
      expect(res.body.params).to.have.keys(["id"]);
      expect(res.body.authUser).to.have.keys(["id", "role", "email", "iat"]);
      expect(res.body.query).to.have.keys(["name"]);
    });
  });
});
