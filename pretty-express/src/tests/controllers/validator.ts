import {
  IsEmail,
  IsOptional,
  IsString,
  ValidationError,
  Validator,
} from "class-validator";
import { HTTP_METHOD } from "../../keys";
import {
  Controller,
  get,
  post,
  patch,
  del,
  requestBody,
  validate,
} from "../../";

export class CreatePostRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;
}

@Controller("/validator")
export class ValidateController {
  @validate(CreatePostRequest)
  @get("/")
  validateWIthSchema(@requestBody data: any) {
    return { message: "received data", data };
  }

  @validate(CreatePostRequest, { whitelist: true })
  @post("/")
  whiteListExample(@requestBody data: any) {
    return { message: "received data", data };
  }
}
