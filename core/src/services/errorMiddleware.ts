import { NextFunction, Request, Response } from "express";
import { HttpErrorResponse } from "../models/httperror";

export function httpErrorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof HttpErrorResponse) {
    const val = err as HttpErrorResponse;
    const jsonWithData = {
      message: val.phrase || "An error occured!",
      error: val.message,
      data: val.data,
    };

    const jsonNoData = {
      message: val.phrase || "An error occured!",
      error: val.message,
    };

    return res
      .status(val.status)
      .json(val.data ? jsonWithData : jsonNoData)
      .end();
  } else {
    next(err);
  }
}
