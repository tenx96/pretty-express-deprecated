import { plainToClass } from "class-transformer";
import { ValidationError, ValidatorOptions, Validator } from "class-validator";
import { json, RequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import { ValidationService, Constructor } from "./validation.interface";
export class ServerValidationService implements ValidationService {
  /**
   *
   * @param type class decorated with package :class-validator
   * @returns middleware for body validation
   */

  validationMiddleware(
    type: Constructor<any>,
    options?: ValidatorOptions
  ): RequestHandler {
    let validator = new Validator();

    return (req, res, next) => {
      let input: any = plainToClass(type, req.body);

      // set forbid unknown as default
      if (!options) {
        options = {
          forbidUnknownValues: true,
        };
      }

      let errors = validator.validateSync(input, options);

      if (errors.length > 0) {
        next(errors);
      } else {
        req.body = input;
        next();
      }
    };
  }

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
  ) {
    if (err instanceof Array && err[0] instanceof ValidationError) {
      res.status(400).json({ errors: err }).end();
    } else {
      next(err);
    }
  }

  validateResponseObject(
    type: Constructor<any>,
    object: Object,
    options?: ValidatorOptions,
    onError?: (err: ValidationError[]) => void
  ) {
    // set whitelist true to remove extra props
    if (!options) {
      options = { whitelist: true };
    }

    let validator = new Validator();

    let input: any = plainToClass(type, object, options);

    let errors = validator.validateSync(input, options);

    if (errors.length > 0) {
      if (onError) {
        onError(errors);
      } else {

        const err_msg = `Error validating given object , ${JSON.stringify(errors)}`
        throw new Error(err_msg);
      }
    } else {
      return input;
    }
  }
}
