import * as request from "supertest";
import { Express } from "express";
import { expect } from "chai";

export interface IStatusBody {
    body : any,
    status : number
}

export function assertHttpEndPoints(
  method: string,
  path: string,
  body: any,
  status: number,
  app: Express
) : Promise<IStatusBody>{
  let agent: any = request.agent;

        return new Promise((resolve,reject) => {
            agent(app)[method](path)
    .send(body)
    .expect(status)
    .end((err: Error, res: any) => {
      if (err) reject(err);
      expect(res).to.haveOwnProperty("body");
      expect(res.status).to.be.equal(200);
      expect(res.body).to.haveOwnProperty("message");
      expect(res.body).to.haveOwnProperty("method");
      expect(res.body.message).to.be.a("string");
      expect(res.body.method).to.be.a("string");
      expect(res.body.method).to.be.equal(method);
        resolve({body : res.body , status : res.status})

    });
        })
}
