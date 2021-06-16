import { ValidatorOptions, ValidationError } from "class-validator";
import { Response, NextFunction, Request, RequestHandler, ErrorRequestHandler } from "express";
import { ValidationErrorHandler } from "../interfaces";

export type Constructor<T> = { new (): T };

export interface ValidationService {

  /**
   *
   * @param type class decorated with package :class-validator
   * @returns middleware for body validation
   */

  validationMiddleware(
    type: Constructor<any>,
    options?: ValidatorOptions
  ): RequestHandler;
  /**
   *
   * @param err express error
   * @param req express request
   * @param res express response
   * @param next express next function
   * error handler for validation
   */
  validationErrorHandler(
    onError  : ValidationErrorHandler
  ): ErrorRequestHandler;

  validateResponseObject(
    type: Constructor<any>,
    object: Object,
    options?: ValidatorOptions,
    onError?: (err: ValidationError[]) => void
  ): any;
}
