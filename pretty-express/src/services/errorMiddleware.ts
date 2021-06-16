import { NextFunction, Request, Response } from "express";
import { HttpErrorResponse } from "../models/httperror";
import { HttpErrorResponseHandler } from "../interfaces";
export function buildHttpErrorMiddleware(
  onHttpError: HttpErrorResponseHandler
) {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpErrorResponse) {
      if (!onHttpError) {
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
        return onHttpError(err, req, res, next);
      }
    } else {
      next(err);
    }
  };
}
