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
describe("AUTHENTICATION tests", () => {
  before(() => {
    const server = new MyServer();
    app = server.getApp;
  });

  afterEach((done) => {
    done();
  });

  describe("JWT authentication tests with token", () => {
    it("request for a token with creds : id , email , role?. Should return a body with token string", () => {
      let token: string;

      request
        .agent(app)
        .get("/auth/token")
        .send({ email: "test@gmail.com", role: "admin", id: "1" })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res).to.have.ownProperty("body");
          expect(res.body).to.have.ownProperty("token");
          console.log(res.body.token);
          token = res.body.token;
        });

      describe("authenticate with recieved token", () => {
        it("use token to access a protected path, auth data will be sent to param marked with @authUser", () => {
          request
            .agent(app)
            .post("/auth/protected")
            .set({
              Authorization: `Bearer ${token}`,
            })
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
              if (err) throw err;
              expect(res).to.have.ownProperty("body");
              expect(res.body).to.have.ownProperty("message");
              expect(res.body).to.have.ownProperty("auth");
              expect(res.body.auth).to.have.keys([
                "id",
                "email",
                "role",
                "iat",
              ]);
            });
        });

        it("use invalid token to access a protected path. should return with status 401", () => {
          request
            .agent(app)
            .post("/auth/protected")
            .set({
              Authorization: `Bearer ${token}1`,
            })
            .expect("Content-Type", /json/)
            .expect(401)
            .end((err, res) => {
              if (err) throw err;
            });
        });

        it("use admin - token to access a path only availabe for role : 'user' > shoud return 401", () => {
          request
            .agent(app)
            .post("/auth/role")
            .set({
              Authorization: `Bearer ${token}`,
            })
            .expect("Content-Type", /json/)
            .expect(401)
            .end((err, res) => {
              if (err) throw err;
            });
        });

        it("use admin - token to access a path only availabe for two role : 'user' and 'admin'. Should pass with status 200", () => {
          request
            .agent(app)
            .post("/auth/multi")
            .set({
              Authorization: `Bearer ${token}`,
            })
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
              if (err) throw err;
            });
        });
      });
    });
  });
});
