import "reflect-metadata";
import { Controller, del, get, middleware, patch, post, requestParams, Server,put } from "../../core/dist";
import express, { Request, Response, NextFunction, Express } from "express";

@middleware(controllerMiddleware)
@Controller("/api/users")
class UserController {
  @get("/")
  async getUsers(req: Request, res: Response, next: NextFunction) {
    return { message: "hello pretty express" };
  }

  @patch("/")
  async a(req: Request, res: Response, next: NextFunction) {
    return { message: "hello pretty express" };
  }

  @del("/")
  async b(req: Request, res: Response, next: NextFunction) {
    return { message: "hello pretty express" };
  }

  @put("/")
  async c(req: Request, res: Response, next: NextFunction) {
    return { message: "hello pretty express" };
  }

  // @requestParams passes the parameter data.
 
  @post("/:id")
  async addUsers(@requestParams data: any) {
    return { msg: "Recieved params ", data };
  }
}


function requestMiddleware (req : Request,res : Response,next : NextFunction) {
  console.log("Entered request middleware. Do something")
  next()
}

function requestMiddleware2 (req : Request,res : Response,next : NextFunction) {
console.log("Entered request middleware 2. Do something")
next()
}

function controllerMiddleware (req : Request,res : Response,next : NextFunction) {
console.log("Entered controller middleware. Do something")
next()
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
const server = new ApplicationServer(app);
server.start();




