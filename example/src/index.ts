import express, { Request, Response } from "express";

import { Server, Controller, get } from "pretty-express";
const app = express();

@Controller("/api/v1")
class UserController {
  @get("/")
  async getUsers(req: Request, res: Response) {
    return res.status(200).send("Welcome to my api server");
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


const server = new ApplicationServer();

server.start()
