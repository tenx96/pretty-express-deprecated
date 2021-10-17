import { ValidationError, ValidatorOptions, Validator } from "class-validator";
import { json, RequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import { ValidationErrorHandler } from "../interfaces";

import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from "class-transformer";

export class ServerValidationService {
  /**
   *
   * @param type class decorated with package :class-validator
   * @returns middleware for body validation
   */

  validationMiddleware(
    type: ClassConstructor<unknown>,
    options?: ValidatorOptions
  ): RequestHandler {
    let validator = new Validator();

    return (req, res, next) => {
      let input: any = plainToClass(type, req.body, {
        ignoreDecorators: true,
      });

      // set forbid unknown as default
      if (!options) {
        options = {
          whitelist: true,
          forbidNonWhitelisted: true,
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

  validationErrorHandler(onError: ValidationErrorHandler) {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof Array && err[0] instanceof ValidationError) {
        if (onError) {
          onError(err, req, res, next);
        } else {
          res.status(400).json({ errors: err }).end();
        }
      } else {
        next(err);
      }
    };
  }

  validateResponseObject(
    type: ClassConstructor<unknown>,
    object: Object,
    validatorOptions?: ValidatorOptions
  ): any | ValidationError[] {
    // set whitelist true to remove extra props
    if (!validatorOptions) {
      validatorOptions = { whitelist: true };
    }

    let validator = new Validator();

    let input: any = plainToClass(type, object, {
      ignoreDecorators: true,
    });

    let errors = validator.validateSync(input, validatorOptions);

    if (errors instanceof Array && errors[0] instanceof ValidationError) {
      throw errors;
    } else {
      return input;
    }
  }

  transformPlainToClass(
    schema: ClassConstructor<unknown>,
    obj: any,
    options?: ClassTransformOptions
  ) {
    return plainToClass(schema, obj, options);
  }
}
