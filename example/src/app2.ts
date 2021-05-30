import "reflect-metadata";
import {
  Controller,
  get,
  middleware,
  post,
  requestParams,
  Server,
  validate
} from "../../core/src";
import express, { Request, Response, NextFunction, Express } from "express";
import { IsEmail, IsOptional, IsString } from "class-validator";
import {validate as vd} from "./validator/template.request"
import { authenticate, authUser, requestBody } from "pretty-express";


export class UserCredentials {
    @IsEmail()
    email: string;
  
    @IsString()
    password: string;
  
    @IsOptional()
    @IsString()
    name: string;
  }

@validate(UserCredentials)
@Controller("/api/users")
class UserController {
  @get("/")
  async getUsers(@requestBody data : any, req: Request, res: Response, next: NextFunction) {
    return { message: "hello pretty express" };
  }

  @authenticate("jwt" , {role : ["admin"]})
  @post("/")
  async addUsers(@requestBody data: UserCredentials , @requestParams params : any , @authUser authUser : any) {
    return  {data};
  }
}

class ApplicationServer extends Server {
  constructor(private app: Express) {
    super(app);
  }

  start() {
    this.addControllersToServer([new UserController()]);
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
    });
  }
}

const app = express();


app.use(express.json())
app.use(express.urlencoded({extended : false}))

const server = new ApplicationServer(app);
server.start();
