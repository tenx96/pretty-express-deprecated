import "reflect-metadata";
import { Express, NextFunction, Router } from "express";
import {
  CONTROLLER_META_KEYS,
  FUNCTION_META_KEYS,
  HTTP_METHOD,
  MIDDLEWARE_META_KEYS,
} from "./keys";

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
  middlewares?: Function[];
  errorMiddlewares?: Function[];
}

interface IFunctionMetaData {
  path: string;
  httpMethod: string;
  propertyKey: string;
  middlewares?: Function[];
  errorMiddlewares?: Function[];
}

export class Server {
  constructor(protected _app: Express) {}

  addControllersToServer(controllerList: Object[]): void {
    try {
      controllerList.forEach((controller) => {
        const controllerData = getDataFromControllerClass(controller);

        const functionsData = getDataFromAllDecoratedFunction(controller);

        const routerData = buildRouterForController(
          functionsData,
          controllerData,
          controller
        );

        this._app.use(routerData.baseUrl, routerData.router);
      });
    } catch (err) {
      console.log("Error adding controllers to server");
      throw err;
    }
  }
}

function getDataFromControllerClass(controller: Object): IControllerMetaData {
  try {
    const prototype = Object.getPrototypeOf(controller).constructor;

    const type = Reflect.getOwnMetadata(CONTROLLER_META_KEYS.type, prototype);
    const baseUrl = Reflect.getOwnMetadata(
      CONTROLLER_META_KEYS.baseUrl,
      prototype
    );

    // get middleware data
    const middlewares =
      Reflect.getOwnMetadata(MIDDLEWARE_META_KEYS.middlewares, prototype) || [];

    const errorMiddlewares =
      Reflect.getOwnMetadata(
        MIDDLEWARE_META_KEYS.errorMiddlewares,
        prototype
      ) || [];

    return { type, baseUrl, middlewares, errorMiddlewares };
  } catch (err) {
    console.log("An error occured while parsing class decorator");
    throw err;
  }
}

function getDataFromAllDecoratedFunction(
  controller: Object
): IFunctionMetaData[] {
  const data: IFunctionMetaData[] = [];

  try {
    const prototype = Object.getPrototypeOf(controller);
    const propertyNames = Object.getOwnPropertyNames(prototype);

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

      // check for middle wares

      const middlewares =
        Reflect.getOwnMetadata(
          MIDDLEWARE_META_KEYS.middlewares,
          prototype,
          propertyKey
        ) || [];

      const errorMiddlewares =
        Reflect.getOwnMetadata(
          MIDDLEWARE_META_KEYS.errorMiddlewares,
          prototype,
          propertyKey
        ) || [];

      // check if httpMethods exists and is available for use in our implementation

      if (Object.values(HTTP_METHOD).includes(httpMethod)) {
        // add middlewares

        data.push({
          path,
          propertyKey,
          httpMethod,
          middlewares,
          errorMiddlewares,
        });

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
    // attach class level/controller middlewares
    if (controllerMetaData.middlewares.length != 0) {
      router.use(...controllerMetaData.middlewares);
    }

   

    functionMetaData.forEach((fdata) => {
      const fullpath = fdata.path;

      router[fdata.httpMethod](
        fullpath,
        ...fdata.middlewares,
        async (request: Request, response: Response, next: NextFunction) => {
          await controller[fdata.propertyKey](request, response, next);
        },
        ...fdata.errorMiddlewares
      );
    });

    // attatch error middlewares if present
    if (controllerMetaData.errorMiddlewares.length != 0) {
      router.use(...controllerMetaData.errorMiddlewares);
    }

    return { baseUrl: controllerMetaData.baseUrl, router };
  } catch (err) {
    console.log("An error occured while building router for give controller");
    throw err;
  }
}
