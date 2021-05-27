import express, { Request, Response, NextFunction } from "express";

const app = express();

function middleware1(req: Request, res: Response, next: NextFunction) {
  console.log("executing middleware 1");
  next();
}

function middleware2(req: Request, res: Response, next: NextFunction) {
  console.log("executing middleware 2");
  next();
}

function middleware3(req: Request, res: Response, next: NextFunction) {
  console.log("executing middleware 3");
  res.status(200).send("Completing execution");
}

const middlewares = [middleware1, middleware2, middleware3];

app.get("/", ...middlewares);

app.listen(5000, () => {
  console.log("starting server");
});
