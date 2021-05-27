import express from "express";
import { Server } from "express-decorators";

const app = express();

export class ApplicationServer extends Server {
  constructor() {
    super(app);
  }



  setupRoutes() {
      app.get("/" , (req ,res) => {
                res.status(200).send()
      })
  }
  start() {

    this.setupRoutes()

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
    });
  }
}
