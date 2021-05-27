import "reflect-metadata"

import { Controller } from "./decorators";
import { Express, NextFunction, Router } from "express";
import { CONTROLLER_META_KEYS, FUNCTION_META_KEYS, HTTP_METHOD } from "./keys";

export type Controller = any;

interface IRouterData {
  baseUrl: string;
  router: Router;
}

/**
 * @type : controller
 * @baseUrl : /users
 */
interface IControllerMetaData {
  type: string;
  baseUrl: string;
}

interface IFunctionMetaData {
  path: string;
  httpMethod: string;
  propertyKey: string;
}

export class Server {
  constructor(protected _app: Express) { }

  addControllersToServer(controllerList: Controller[]): void {
    try {
      controllerList.forEach((controller) => {
        const controllerData = getDataFromControllerClass(controller);

        console.log("controller Data : ", controllerData);

        const functionsData = getDataFromAllDecoratedFunction(controller);

        console.log("functions Data : ", functionsData);

        const routerData = buildRouterForController(
          functionsData,
          controllerData,
          controller
        );

        console.log("router Data : ", routerData);

        this._app.use(routerData.baseUrl, routerData.router);
      });
    } catch (err) {
      console.log("Error adding controllers to server");
      throw err;
    }
  }
}

function getDataFromControllerClass(
  controller: Controller
): IControllerMetaData {
  try {
    const type = Reflect.getOwnMetadata(CONTROLLER_META_KEYS.type, controller);
    const baseUrl = Reflect.getOwnMetadata(
      CONTROLLER_META_KEYS.baseUrl,
      controller
    );

    return { type, baseUrl };
  } catch (err) {
    console.log("An error occured while parsing class decorator");
    throw err;
  }
}

function getDataFromAllDecoratedFunction(controller: any): IFunctionMetaData[] {
  const data: IFunctionMetaData[] = [];

  try {
    const prototype = controller.prototype;
    const propertyNames = Object.getOwnPropertyNames(controller.prototype);

    propertyNames.forEach((propertyKey) => {
      const httpMethod = Reflect.getOwnMetadata(
        FUNCTION_META_KEYS.httpMethod,
        prototype,
        propertyKey
      );

      const path = Reflect.getOwnMetadata(
        FUNCTION_META_KEYS.path,
        prototype,
        propertyKey
      );

      // check if httpMethods exists and is available for use in our implementation

      if (Object.values(HTTP_METHOD).includes(httpMethod)) {
        data.push({ path, propertyKey, httpMethod });

        // we have implementation for given httpMethid
      } else {
        // http method not implemented or other function eg constructor.hence ignored
      }
    });

    return data;
  } catch (err) {
    console.log("An error occured while parsing function decorator");
    throw err;
  }
}

function buildRouterForController(
  functionMetaData: IFunctionMetaData[],
  controllerMetaData: IControllerMetaData,
  controller: any
): IRouterData {
  const router: any = Router();

  try {
    functionMetaData.forEach((fdata) => {
      const fullpath = fdata.path;

      router[fdata.httpMethod](
        fullpath,
        async (request: Request, response: Response, next: NextFunction) => {
          await controller.prototype[fdata.propertyKey](
            request,
            response,
            next
          );
        }
      );
    });

    return { baseUrl: controllerMetaData.baseUrl, router };
  } catch (err) {
    console.log("An error occured while building router for give controller");
    throw err;
  }
}
