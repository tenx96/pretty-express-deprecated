import "reflect-metadata";
import { Express, NextFunction, Router } from "express";
import {
  AUTH_META_KEYS,
  CONTROLLER_META_KEYS,
  FUNCTION_META_KEYS,
  HTTP_METHOD,
  MIDDLEWARE_META_KEYS,
} from "./keys";
import { JwtAuthenticationStrategy } from "./authentication.strategy";

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
  authData?: IAuthenticationData;
}

interface IFunctionMetaData {
  path: string;
  httpMethod: string;
  propertyKey: string;
  middlewares?: Function[];
  errorMiddlewares?: Function[];
  authData?: IAuthenticationData;
}

interface IAuthenticationStrategyMetaData {
  name: string;
}

interface IAuthenticationData {
  strategy: string;
  role: string;
}

export class Server {
  authStrategies: Map<string, JwtAuthenticationStrategy>;

  constructor(protected _app: Express) {
    this.authStrategies = new Map();
  }

  addControllersToServer(controllerList: Object[]): void {
    try {
      controllerList.forEach((controller) => {
        const controllerData = getDataFromControllerClass(controller);

        const functionsData = getDataFromAllDecoratedFunction(controller);

        const routerData = buildRouterForController(
          functionsData,
          controllerData,
          controller,
          this.authStrategies
        );

        this._app.use(routerData.baseUrl, routerData.router);
      });
    } catch (err) {
      console.log("Error adding controllers to server");
      throw err;
    }
  }

  /**
   *
   * @param strategyList get list of strategies that extends our authentication class
   */
  addAuthenticationStrategies(strategyList: JwtAuthenticationStrategy[]): void {
    strategyList.forEach((st) => {
      const { name } = getDataFromAuthenticationStrategy(st);
      this.authStrategies.set(name, st);
    });
  }
}

/**
 *
 * @param strategy name of the strategy
 * @returns returns the name of the auth service marked with @AuthStrategy
 */
function getDataFromAuthenticationStrategy(
  strategy: Object
): IAuthenticationStrategyMetaData {
  const prototype = Object.getPrototypeOf(strategy).constructor;

  const name = Reflect.getOwnMetadata(AUTH_META_KEYS.authService, prototype);

  return { name };
}

/**
 *
 * @param controller : controller object marked with @controller
 * @returns meta data
 */

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

    // get authentication data
    const authStrategy =
      Reflect.getOwnMetadata(AUTH_META_KEYS.strategy, prototype) || "";

    const authRole =
      Reflect.getOwnMetadata(AUTH_META_KEYS.role, prototype) || "";

    return {
      type,
      baseUrl,
      middlewares,
      errorMiddlewares,
      authData: { role: authRole, strategy: authStrategy },
    };
  } catch (err) {
    console.log("An error occured while parsing class decorator");
    throw err;
  }
}

/**
 *
 * @param controller controller object marked with @controller
 * @returns meta data from decorated functions
 */

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

      // check for auth data

      const authStrategy =
        Reflect.getOwnMetadata(
          AUTH_META_KEYS.strategy,
          prototype,
          propertyKey
        ) || "";

      const authRole =
        Reflect.getOwnMetadata(AUTH_META_KEYS.role, prototype, propertyKey) ||
        "";

      // check if httpMethods exists and is available for use in our implementation

      if (Object.values(HTTP_METHOD).includes(httpMethod)) {
        // add middlewares

        data.push({
          path,
          propertyKey,
          httpMethod,
          middlewares,
          errorMiddlewares,
          authData: {
            role: authRole,
            strategy: authStrategy,
          },
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

/**
 *
 * @param functionMetaData
 * @param controllerMetaData
 * @param controller
 * @returns build a router with given meta data
 */

function buildRouterForController(
  functionMetaData: IFunctionMetaData[],
  controllerMetaData: IControllerMetaData,
  controller: any,
  authStrategies : Map<string, JwtAuthenticationStrategy>
): IRouterData {
  const router: any = Router();

  try {
    // attatch controller level authentication after checking meta data
    const authData = controllerMetaData.authData;

    const authMiddleware = getAuthenticationMiddleware(authData , authStrategies);

    if (authMiddleware) {
      router.use(authMiddleware);
    }

    // attach class level/controller middlewares
    if (controllerMetaData.middlewares.length != 0) {
      router.use(...controllerMetaData.middlewares);
    }

    functionMetaData.forEach((fdata) => {
      const fullpath = fdata.path;
      // create RouteHandler

      // extract authData

      const funcAuthMiddleware = getAuthenticationMiddleware(fdata.authData , authStrategies);
      if (funcAuthMiddleware) {
        // add auth middleware to the beggining of the middleware list
        fdata.middlewares.unshift(funcAuthMiddleware);
      }

      router[fdata.httpMethod](
        fullpath,
        ...fdata.middlewares,
        async (request: Request, response: Response, next: NextFunction) => {
          try {
            await controller[fdata.propertyKey](request, response, next);
          } catch (err) {
            next(err);
          }
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

function getAuthenticationMiddleware(authData: IAuthenticationData , authStrategies : Map<string , JwtAuthenticationStrategy>) {
  if (authData && authData.strategy) {
    // check if auth strategy is registered at server level
    if (!authStrategies.has(authData.strategy)) {
      throw new Error(
        `Authenticaion Service not registered at Server Level  , name : ${authData.strategy}`
      );
    } else {
      // strategy exists register middleware
      const authController = authStrategies.get(
        authData.strategy
      )

      return authController.buildMiddleware(authData.role || "");
    }
  } else {
    // no auth strategy
    return null;
  }
}
