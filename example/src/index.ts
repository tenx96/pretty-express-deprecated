import express, {   NextFunction, Request, Response } from "express";

import { Server, Controller, get, middleware, post , errorMiddleware } from "pretty-express";
const app = express();



@middleware(classMiddleware)
@errorMiddleware(demoError)
@Controller("/api/v1")
class UserController {
 

  @middleware(demoMiddleware, demoMiddleware2)
  @get("/")
  async getUsers(req: Request, res: Response, next : NextFunction) {
    return next(new Error("I am bad!"))
    return res.status(200).send("Welcome to my api server");
  }

  @middleware(demoMiddleware)
  @post("/")
  async addUsers(req: Request, res: Response) {
    return res.status(200).send("No I wont add users");
  }
}
export class ApplicationServer extends Server {
  constructor() {
    super(app);
  }


  start() {
    this.addControllersToServer([new UserController()]);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
    });
  }
}



function demoMiddleware(req: Request, res : Response , next : NextFunction){
  console.log("you have entered a request level middleware")
  next()
}

function demoMiddleware2(req: Request, res : Response , next : NextFunction){
  console.log("you have entered a request level middleware 2222")
  next()
}


function classMiddleware(req: Request, res : Response , next : NextFunction){
  console.log("you have entered a controller level middleware")
  next()
}


function demoError(err : Error, req: Request, res : Response , next : NextFunction) {
  console.log("Warning........! You entered a error middleware")
  return res.status(500).send("You are noob!!!")
}


const server = new ApplicationServer();

server.start()
