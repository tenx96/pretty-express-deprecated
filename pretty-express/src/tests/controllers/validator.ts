import { IsEmail, IsOptional, IsString } from "class-validator";
import {
  Controller,
  get,
  HttpResponse,
  post,
  requestBody,
  validate,
  validateResponse,
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

export class DemoResponseSchema {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;
}

@Controller("/validator")
export class ValidateController {
  @validate(CreatePostRequest, {})
  @get("/")
  validateWIthSchema(@requestBody data: any) {
    return { message: "received data", data };
  }

  @validate(CreatePostRequest, { whitelist: true })
  @post("/")
  whiteListExample(@requestBody data: any) {
    return { message: "received data", data };
  }

  // response validation demo
  @validateResponse(DemoResponseSchema)
  @get("/validate-res-1")
  async responseValidationDemo1(@requestBody data: any) {
    return { name: "tenx", email: "tenx@gmail.com" };
  }

  @validateResponse(DemoResponseSchema)
  @get("/validate-res-2")
  async responseValidationDemo2(@requestBody data: any) {
    // should remove extra data from response
    return {
      name: "tenx",
      email: "tenx@gmail.com",
      extra1: "something",
      extra2: "something",
    };
  }

  @validateResponse(DemoResponseSchema)
  @get("/validate-res-3")
  async responseValidationDemo3(@requestBody data: any) {
    // invalid email
    // should throw error
    return { name: "tenx", email: "tenx@@gmail.com" };
  }

  @validateResponse(DemoResponseSchema)
  @get("/validate-res-4")
  async responseValidationDemo4(@requestBody data: any) {
    // passed optional param. should pass through
    return { name: "tenx", email: "tenx@gmail.com", address: "some address" };
  }


  // validate response with HttpResponse as returned type
  @validateResponse(DemoResponseSchema)
  @get("/validate-res-5")
  async responseValidationDemo5(@requestBody data: any) {
    const user = { name: "tenx", email: "tenx@gmail.com" };

    return HttpResponse.OK(user);
  }

  @validateResponse(DemoResponseSchema)
  @get("/validate-res-6")
  async responseValidationDemo6(@requestBody data: any) {
    // should remove extra data from response
    const user = {
      name: "tenx",
      email: "tenx@gmail.com",
      extra1: "something",
      extra2: "something",
    };

    return HttpResponse.OK(user);
  }

  @validateResponse(DemoResponseSchema)
  @get("/validate-res-7")
  async responseValidationDemo7(@requestBody data: any) {
    // invalid email
    // should throw error
    const user = { name: "tenx", email: "tenx@@gmail.com" };
    return HttpResponse.OK(user);
  }

  // note : this is a post request .
  @validateResponse(DemoResponseSchema)
  @post("/validate-res-8")
  async responseValidationDemo8(@requestBody data: any) {
    // passed optional param. should pass through
    const user = {
      name: "tenx",
      email: "tenx@gmail.com",
      address: "some address",
    };
    return HttpResponse.CREATED(user);
  }
}
