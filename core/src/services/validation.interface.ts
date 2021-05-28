import { ValidatorOptions } from "class-validator";
import { Response, NextFunction, Request, RequestHandler } from "express";

export type Constructor = { new (): any };

export interface ValidationService {
  /**
   *
   * @param type class decorated with package :class-validator
   * @returns middleware for body validation
   */

  validationMiddleware(type: Constructor, options? : ValidatorOptions): RequestHandler;
  /**
   *
   * @param err express error
   * @param req express request
   * @param res express response
   * @param next express next function
   * error handler for validation
   */
  validationErrorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}
