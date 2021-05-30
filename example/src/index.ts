import bodyParser, { json } from "body-parser";
import express, { NextFunction, Request, Response } from "express";

import {
  Server,
  Controller,
  get,
  post,
  requestBody,
  patch,
  del,
  requestParams,
  put,
} from "pretty-express";
const app = express();

import { MyJwtAuthService } from "./authentication.service";
import { CreatePostRequest } from "./validator/template.request";

const testService = new MyJwtAuthService();

@Controller()
class UserController {
  @get("/")
  async getUsers(req: Request, res: Response, next: NextFunction) {
    const token = await testService.generateToken({
      email: "test@gmail.com",
      id: "abc",
      role: "admin",
    });
    return { token };
  }
  
  @del("/")
  async de(req: Request, res: Response, next: NextFunction) {
    return { method: "delete" };
  }

  @put("/")
  async asdas(req: Request, res: Response, next: NextFunction) {
    return { method: "put" };
  }

  @patch("/")
  async asd(req: Request, res: Response, next: NextFunction) {
    return { method: "patch" };
  }

  @post("/:id")
  async addUsers(
    @requestBody data: CreatePostRequest,
    @requestParams params: Object
  ) {
    return { msg: "Recieved a body ", data };
  }
}

export class ApplicationServer extends Server {
  constructor() {
    super(app);
  }

  start() {
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));

    this.addAuthenticationStrategies([new MyJwtAuthService()]);

    this.addControllersToServer([new UserController()]);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
    });
  }
}

function demoMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log("you have entered a request level middleware");
  next();
}

function demoMiddleware2(req: Request, res: Response, next: NextFunction) {
  console.log("you have entered a request level middleware 2222");
  next();
}

function classMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log("you have entered a controller level middleware");
  next();
}

function demoError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Warning........! You entered a error middleware");
  return res.status(500).send("You are noob!!!");
}

const server = new ApplicationServer();

server.start();
