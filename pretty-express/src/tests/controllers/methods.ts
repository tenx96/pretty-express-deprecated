import { HTTP_METHOD } from "../../keys";
import { Controller, get, post, patch, del, requestBody, put , all} from "../../";
import { requestParams , requestQuery} from "../../";


@Controller("/api")
export class TestController {
  @get("/")
  getSomething(@requestBody body: any) {
    return { message: "Called get on /api", method: HTTP_METHOD.GET };
  }

  @post("/")
  postSomething(@requestBody body: any) {
    return { message: "Called post on /api", method: HTTP_METHOD.POST };
  }

  @patch("/")
  patchSomething(@requestBody body: any) {
    return { message: "Called patch on /api", method: HTTP_METHOD.PATCH };
  }

  @del("/")
  deleteSmething(@requestBody body: any) {
    return { message: "Called del on /api", method: HTTP_METHOD.DELETE };
  }

  @put("/")
  putSomething(@requestBody body: any) {
    return { message: "Called del on /api", method: HTTP_METHOD.PUT };
  }

  @all("/all")
  allRoutes(@requestBody body: any) {
    return { message: "Called all on /all", method: HTTP_METHOD.ALL };
  }

  @get("/params/:id/:name")
  paramsCheck(@requestBody body: any, @requestParams params: any) {
    return {
      message: "Called get on /api",
      method: HTTP_METHOD.GET,
      body,
      params,
    };
  }

  @get("/query")
  queryChecks(@requestQuery query : any) {
    return {
      message: "Called get on /api",
      method: HTTP_METHOD.GET,
      query
    };
  }
}
