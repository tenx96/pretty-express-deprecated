import { HTTP_METHOD } from "../../keys";
import { Controller, get, post, patch, del, requestBody } from "../../";
import { NextFunction, Request, Response } from "express";
import { middleware } from "../../";

@middleware(controllerMiddleware)
@Controller("/middleware")
export class MidController {
  @middleware(requestMiddleware)
  @get("/")
  getSomething(@requestBody body: any, request: any) {
    return { message: request.last };
  }

  @post("/")
  postSomething(@requestBody body: any, request: any) {
    return { message: request.last };
  }
  @middleware(requestMiddleware, requestMiddleware2)
  @patch("/")
  patchSomething(@requestBody body: any, request: any) {
    return { message: request.last };
  }
}

function requestMiddleware(req: any, res: Response, next: NextFunction) {
  //  add a parameter on request to evaluate for check
  req.last = "last changed by :request middleware";
  next();
}

function requestMiddleware2(req: any, res: Response, next: NextFunction) {
  //  add a parameter on request to evaluate for check
  req.last = "last changed by :request middleware2";
  next();
}

function controllerMiddleware(req: any, res: Response, next: NextFunction) {
  //  add a parameter on request to evaluate for check
  req.last = "last changed by :controller middleware";
  next();
}
