import {
  authenticate,
  authUser,
  Controller,
  get,
  requestBody,
  requestParams,
  requestQuery,
} from "../../";
import { MyJwtAuthService } from "../auth.serv";

@Controller("/parameter")
export class ParameterController {
  constructor() {}

  @get("/body")
  async getBody(@requestBody body: any) {
    return { body };
  }

  @get("/params/:id")
  async getParams(@requestParams params: any) {
    return { params };
  }

  @get("/query")
  async getQuery(@requestQuery query: any) {
    return { query };
  }

  @authenticate("jwt")
  @get("/authUser")
  async authUser(@authUser authUser: any) {
    return { authUser };
  }

  @authenticate("jwt")
  @get("/params-authuser/:id")
  async paramsAuth(@requestParams params: any, @authUser authUser: any) {
    return { params, authUser };
  }

  @authenticate("jwt")
  @get("/authuser-params/:id")
  async authParams(@authUser authUser: any, @requestParams params: any) {
    return { params, authUser };
  }

  @authenticate("jwt")
  @get("/authuser-params-query/:id")
  async authParamsQuery(
    @authUser authUser: any,
    @requestParams params: any,
    @requestQuery query: any
  ) {
    return { params, authUser, query };
  }
}
