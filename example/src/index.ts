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
  validate,
  authenticate,
  authUser,
  middleware,
  HttpResponse,
  HttpError,
} from "pretty-express";
import { UserSchema } from "./User";
const app = express();

import { MyJwtAuthService } from "./authentication.service";

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
  @middleware(demoMiddleware)
  @put("/")
  async asdas(req: Request, res: Response, next: NextFunction) {
    return new HttpResponse(201, { message: "Updated" });
  }

  @patch("/")
  async asd(req: Request, res: Response, next: NextFunction) {
    throw new HttpError(400, "Hello Erro!");
  }

  @authenticate("jwt")
  @validate(UserSchema)
  @post("/:id")
  async addUsers(
    @requestBody data: UserSchema,
    @authUser currentUser: any,
    @requestParams params: Object
  ) {
    console.log("body", data);
    console.log("user", currentUser);
    console.log("params", params);

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

const server = new ApplicationServer();

server.start();
