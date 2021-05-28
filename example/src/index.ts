import express, {   NextFunction, Request, Response } from "express";

import { Server, Controller, get, middleware, post , errorMiddleware, authenticate,  } from "pretty-express";
const app = express();

import {MyJwtAuthService} from "./authentication.service"


const testService = new MyJwtAuthService()

@errorMiddleware(demoError)
@Controller()
class UserController {
 

  
  @get("/")
  
  async getUsers(req: Request, res: Response, next : NextFunction) {
    const token = await testService.generateToken({email : "test@gmail.com" , id : "abc" , role:"admin"})
    return res.status(200).send(token);
  }

 
  @middleware(demoMiddleware)
  @authenticate("jwt" , {role : "farmer"})
  @post("/")
  async addUsers(req: Request, res: Response) {

    return res.status(200).send("OMG IT WORKS!")
  }
}
export class ApplicationServer extends Server {
  constructor() {
    super(app);
  }


  start() {
    this.addAuthenticationStrategies([testService])
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
