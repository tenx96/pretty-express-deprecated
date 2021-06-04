import { IParameterDetails } from "../interfaces";
import {Request, Response, NextFunction} from "express"



// send arguments to decorated function with arguments in order from the param meta data
export async function executeFucntionWithDecoratedArguments(
    controller: any,
    propertyKey: string,
    data: {
      arg: IParameterDetails;
      body: Object;
      params: Object;
      authUser: Object;
      query : Object
    },
    handler: { request: Request; response: Response; next: NextFunction }
  ) : Promise<any>{
    // sort the given parameters
    const parameterObj: Object[] = [];
  
    if (data.arg) {
      // remove undefined
  
      let entries = Object.entries(data.arg);
      // [["body",0],["authUser",2],["params",1]]
  
      let sorted = entries.sort((a, b) => a[1] - b[1]);
      // [["body",0],["params",1],["authUser",2]]
  
      // remove undefined indexes
      let filtered = sorted.filter((item) => item[1] != null);
  
      // convert to object
      let sortedObj = filtered.reduce(
        (acc: any, [k, v]) => ((acc[k] = v), acc),
        {}
      );
  
      // {"body" : 0, "params" : 1, "authUser" : 2}
      Object.keys(sortedObj).forEach((key) => {
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
        }
          else if (key == "requestQuery") {
            obj = data.query
          
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
  