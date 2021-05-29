import "reflect-metadata";
import express from "express";
import {Server } from "../";
import { TestController } from "./controllers";
import { MidController,ValidateController } from "./controllers";
import { MyJwtAuthService } from "./auth.serv";
import { AuthController } from "./controllers/auth";

const app = express();


export class MyServer extends Server {
  constructor() {
    super(app);
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use((req,res,next) => {
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        });
        next()
    })
    
    let authService = new MyJwtAuthService();
    this.addAuthenticationStrategies([authService])
    this.addControllersToServer([ new AuthController(authService), new TestController(), new MidController, new ValidateController]);
    
  }

  start() {
    app.listen(3000, () => {
      console.log("Listening to server http://localhost:3000");
    });
  }

  public get getApp() {
      return app;
  }
}
