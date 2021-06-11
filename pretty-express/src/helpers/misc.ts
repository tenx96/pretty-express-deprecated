import { IParameterDetails } from "../interfaces";
import { Request, Response, NextFunction } from "express";

// send arguments to decorated function with arguments in order from the param meta data
export async function executeFucntionWithDecoratedArguments(
  controller: any,
  propertyKey: string,
  data: {
    arg: IParameterDetails;
    body: Object;
    params: Object;
    authUser: Object;
    query: Object;
  },
  handler: { request: Request; response: Response; next: NextFunction }
): Promise<any> {
  // sort the given parameters

  const parameterObj: Object[] = [];

  if (data.arg) {
    // remove undefined

    let entries = Object.entries(data.arg);

    // remove undefined indexes
    let filtered = entries.filter((item) => item[1] != null);

    // [["body",0],["authUser",2],["params",1]]

    let sorted = filtered.sort((a, b) => a[1] - b[1]);
    // [["body",0],["params",1],["authUser",2]]

    // convert to array of keys
    let sortedKeys = sorted.map((x) => x[0]);
    // ["body" , "params" , "authUser"]

    sortedKeys.forEach((key) => {
      /**interface IParameterDetails {
        requestBody: number;
         requestParams: number;
        authUser: number;
  } */
      let obj;
      if (key == "requestBody") {
        obj = data.body;
      } else if (key == "requestParams") {
        obj = data.params;
      } else if (key == "requestQuery") {
        obj = data.query;
      } else {
        // authUser
        obj = data.authUser;
      }
      parameterObj.push(obj);
    });
  }

  return await controller[propertyKey](
    ...parameterObj,
    ...Object.values(handler)
  );
}
