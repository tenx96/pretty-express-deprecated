import { IsEmail, IsOptional, IsString ,IsObject, ValidateNested} from "class-validator";
import { Expose, Exclude, Type } from "class-transformer";
import {
  Controller,
  get,
  HttpResponse,
  post,
  requestBody,
  validate,
  transformResponse,
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


@Exclude()
class NestedSchema {
  @IsString()
  @Expose()
  valid: string;

  invalid : string
}

@Exclude()
  class DemoResponseSchema {
  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  name: string;

  @IsString()
  @IsOptional()
  @Expose()
  address?: string;


  @IsObject()
  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => NestedSchema)
  nested?: NestedSchema;

}



@Exclude()
 class DemoTransformSchema {
  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  address?: string;

  something?: string;
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

  // response validation demo
  @transformResponse(DemoResponseSchema)
  @get("/validate-res-1")
  async responseValidationDemo1(@requestBody data: any) {
    return { name: "tenx", email: "tenx@gmail.com" };
  }

  @transformResponse(DemoResponseSchema)
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

  @transformResponse(DemoResponseSchema)
  @get("/validate-res-3")
  async responseValidationDemo3(@requestBody data: any) {
    // invalid email
    // should throw error
    return { name: "tenx", email: "tenx@@gmail.com" };
  }

  @transformResponse(DemoResponseSchema  )
  @get("/validate-res-4")
  async responseValidationDemo4(@requestBody data: any) {
    // passed optional param. should pass through
    return { name: "tenx", email: "tenx@gmail.com", address: "some address" };
  }

  // validate response with HttpResponse as returned type
  @transformResponse(DemoResponseSchema)
  @get("/validate-res-5")
  async responseValidationDemo5(@requestBody data: any) {
    const user = { name: "tenx", email: "tenx@gmail.com" };

    return HttpResponse.OK(user);
  }

  @transformResponse(DemoResponseSchema)
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

  @transformResponse(DemoResponseSchema)
  @get("/validate-res-7")
  async responseValidationDemo7(@requestBody data: any) {
    // invalid email
    // should throw error
    const user = { name: "tenx", email: "tenx@@gmail.com" };
    return HttpResponse.OK(user);
  }

  // note : this is a post request .
  @transformResponse(DemoResponseSchema)
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



  @transformResponse(DemoResponseSchema)
  @post("/validate-res-9")
  async resNested(@requestBody data: any) {
    // passed optional param. should pass through
    const user = {
      name: "tenx",
      email: "tenx@gmail.com",
      address: "some address",
      invalid : "invalid data",
      nested : {
        valid : "this is valid",
        invalid : "this is invalid"
      }
    };
    return HttpResponse.CREATED(user);
  }



  @transformResponse(DemoTransformSchema)
  @post("/transform-res-1")
  async transformResponse1(@requestBody data: any) {
    // passed optional param. should pass through
    const user : DemoTransformSchema = {
      name: "tenx",
      email: "tenx@gmail.com",
      address: "some address",
      something : "true"
    };
    return HttpResponse.CREATED(user);
  }

  @transformResponse(DemoTransformSchema)
  @post("/transform-res-2")
  async transformResponse2(@requestBody data: any) {
    // passed optional param. should pass through
    const user : DemoTransformSchema = {
      name: "tenx",
      email: "tenx@gmail.com",
      address: "some address"
    };
    return HttpResponse.CREATED(user);
  }


  @transformResponse(DemoTransformSchema)
  @post("/transform-res-3")
  async transformResponse3(@requestBody data: any) {
    // passed optional param. should pass through
    const user : DemoTransformSchema = {
      name: "tenx",
      email: "tenx@gmail.com",
      address: "some address",
      something : "true"
    };
    return user;
  }

  @transformResponse(DemoTransformSchema)
  @post("/transform-res-4")
  async transformResponse4(@requestBody data: any) {
    // passed optional param. should pass through
    const user : DemoTransformSchema = {
      name: "tenx",
      email: "tenx@gmail.com",
      address: "some address"
    };
    return user;
  }


}
