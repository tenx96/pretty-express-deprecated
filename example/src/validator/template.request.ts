// ref : https://www.worl.co/2016/12/building-an-api-backend-with-typescript-and-express---part-two-validation/

import { IsEmail, IsOptional, IsString, ValidationError, Validator } from "class-validator";
import { NextFunction, RequestHandler, Response } from "express";
import { plainToClass } from "class-transformer";
export class CreatePostRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;


  @IsOptional()
  @IsString()
  name : string;
}

type Constructor = { new (): any };

export function validate(type: Constructor): RequestHandler {
  let validator = new Validator();

  return (req, res, next) => {
    let input: any = plainToClass(type, req.body);

    console.log("converted", input);
    console.log("raw", req.body);

    let errors = validator.validateSync(input , {whitelist : true});


 



    if (errors.length > 0) {
      next(errors);
    } else {
      req.body = input;
      next();
    }
  };
}

export function validationError(
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
