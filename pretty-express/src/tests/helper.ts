import * as request from "supertest";
import { Express } from "express";
import { expect } from "chai";

export interface IStatusBody {
  body: any;
  status: number;
}

export function assertHttpEndPoints(
  method: string,
  path: string,
  body: any,
  status: number,
  app: Express
): Promise<IStatusBody> {
  let agent: any = request.agent;

  return new Promise((resolve, reject) => {
    agent(app)
      [method](path)
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
        resolve({ body: res.body, status: res.status });
      });
  });
}

export function getAllExpressRoutes(app: Express): void {
  function print(path: any, layer: any) {
    if (layer.route) {
      layer.route.stack.forEach(
        print.bind(null, path.concat(split(layer.route.path)))
      );
    } else if (layer.name === "router" && layer.handle.stack) {
      layer.handle.stack.forEach(
        print.bind(null, path.concat(split(layer.regexp)))
      );
    } else if (layer.method) {
      console.log(
        "%s /%s",
        layer.method.toUpperCase(),
        path.concat(split(layer.regexp)).filter(Boolean).join("/")
      );
    }
  }

  function split(thing: any) {
    if (typeof thing === "string") {
      return thing.split("/");
    } else if (thing.fast_slash) {
      return "";
    } else {
      var match = thing
        .toString()
        .replace("\\/?", "")
        .replace("(?=\\/|$)", "$")
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
      return match
        ? match[1].replace(/\\(.)/g, "$1").split("/")
        : "<complex:" + thing.toString() + ">";
    }
  }

  app._router.stack.forEach(print.bind(null, []));
}
