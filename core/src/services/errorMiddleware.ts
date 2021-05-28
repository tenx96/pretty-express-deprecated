import { NextFunction, Request, Response } from "express";
import { HttpError } from "../models/httperror";

export function httpErrorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof HttpError) {
    const val = err as HttpError;
    return res
      .status(val.status)
      .json({
        message: "An error occured!",
        error: val.message,
      })
      .end();
  } else {
    next(err);
  }
}
