import "reflect-metadata";
import { Express, NextFunction, Request, Response, Router } from "express";
import {
  AUTH_META_KEYS,
  CONTROLLER_META_KEYS,
  FUNCTION_META_KEYS,
  HTTP_METHOD,
  MIDDLEWARE_META_KEYS,
  VALIDATOR_META_KEYS,
} from "./keys";
import { JwtAuthenticationStrategy } from "./services/authentication.service";
import { ValidationService } from "./services/validation.interface";
import { ServerValidationService } from "./services/validation.service";
import { ValidatorOptions } from "class-validator";
import { HttpResponse } from "./models/httpresponse";
import { httpErrorMiddleware } from "./services/errorMiddleware";

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
  validationData?: IValidationData;
}

interface IFunctionMetaData {
  path: string;
  httpMethod: string;
  propertyKey: string;
  middlewares?: Function[];
  errorMiddlewares?: Function[];
  authData?: IAuthenticationData;
  validationData?: IValidationData;
}

interface IAuthenticationStrategyMetaData {
  name: string;
}

interface IAuthenticationData {
  strategy: string;
  role: string;
}

interface IValidationData {
  schema: any;
  options?: ValidatorOptions;
}

export class Server {
  private authStrategies: Map<string, JwtAuthenticationStrategy>;
  private validationService: ValidationService;

  constructor(protected _app: Express) {
    this.authStrategies = new Map();
    this.validationService = new ServerValidationService();
  
  }

  /**
   *
   * @param controllerList list of controllers marked with @controller
   */

  addControllersToServer(controllerList: Object[]): void {
    try {
      controllerList.forEach((controller) => {
        const controllerData = getDataFromControllerClass(controller);

        const functionsData = getDataFromAllDecoratedFunction(controller);

        const routerData = buildRouterForController(
          functionsData,
          controllerData,
          controller,
          this.authStrategies,
          this.validationService
        );

        this._app.use(routerData.baseUrl, routerData.router);
      });


      // add base error handler
      this._app.use(httpErrorMiddleware)
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

  /**
   *
   * @param service service that implements ValidationService to replace default validation service
   *
   */
  replaceValidationService(service: ValidationService) {
    this.validationService = service;
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

    // get validation data
    const validationSchema = Reflect.getOwnMetadata(
      VALIDATOR_META_KEYS.schema,
      prototype
    );

    const validationOptions =
      Reflect.getOwnMetadata(VALIDATOR_META_KEYS.options, prototype) || {};

    return {
      type,
      baseUrl,
      middlewares,
      errorMiddlewares,
      authData: { role: authRole, strategy: authStrategy },
      validationData: {
        schema: validationSchema,
        options: validationOptions,
      },
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

      // check for validation data

      const validationSchema = Reflect.getOwnMetadata(
        VALIDATOR_META_KEYS.schema,
        prototype,
        propertyKey
      );

      const validationOptions = Reflect.getOwnMetadata(
        VALIDATOR_META_KEYS.options,
        prototype,
        propertyKey
      );

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
          validationData: {
            schema: validationSchema,
            options: validationOptions,
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
  authStrategies: Map<string, JwtAuthenticationStrategy>,
  validationService: ValidationService
): IRouterData {
  const router: any = Router();

  try {
    // attatch controller level authentication after checking meta data
    const authData = controllerMetaData.authData;

    const authMiddleware = getAuthenticationMiddleware(
      authData,
      authStrategies
    );

    if (authMiddleware) {
      router.use(authMiddleware);
    }

    // attach class level/controller middlewares
    if (controllerMetaData.middlewares.length != 0) {
      router.use(...controllerMetaData.middlewares);
    }

    // attach controller level validator
    if (controllerMetaData.validationData) {
      const { schema, options } = controllerMetaData.validationData;
      router.use(validationService.validationMiddleware(schema, options));
    }

    functionMetaData.forEach((fdata) => {
      const fullpath = fdata.path;
      // create RouteHandler

      // extract authData

      const funcAuthMiddleware = getAuthenticationMiddleware(
        fdata.authData,
        authStrategies
      );
      if (funcAuthMiddleware) {
        // add auth middleware to the beggining of the middleware list
        fdata.middlewares.unshift(funcAuthMiddleware);
      }

      // add request level middlewares
      if (fdata.validationData) {
        const { schema, options } = fdata.validationData;

        fdata.middlewares.push(
          validationService.validationMiddleware(schema, options)
        );
      }

      router[fdata.httpMethod](
        fullpath,
        ...fdata.middlewares,
        async (request: Request, response: Response, next: NextFunction) => {
          try {
            const returnedVal = await controller[fdata.propertyKey](request, response, next);
            handleFunctionReturnValue(request,response,next,returnedVal);
            
          } catch (err) {
            next(err);
          }
        },
        ...fdata.errorMiddlewares
      );
    });

    // attatch error middlewares
    if (validationService) {
      router.use(validationService.validationErrorHandler);
    }

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

function getAuthenticationMiddleware(
  authData: IAuthenticationData,
  authStrategies: Map<string, JwtAuthenticationStrategy>
) {
  if (authData && authData.strategy) {
    // check if auth strategy is registered at server level
    if (!authStrategies.has(authData.strategy)) {
      throw new Error(
        `Authenticaion Service not registered at Server Level  , name : ${authData.strategy}`
      );
    } else {
      // strategy exists register middleware
      const authController = authStrategies.get(authData.strategy);

      return authController.buildMiddleware(authData.role || "");
    }
  } else {
    // no auth strategy
    return null;
  }
}

/**
 * 
 * @param req express request
 * @param res express response
 * @param next express next func
 * returns 200 res by default. if returned value is of custom type `HttpResponse` handle it accordingly
 */
function handleFunctionReturnValue(req : Request,res : Response,next : NextFunction , returnedValue : Object | HttpResponse) : void {

  if(returnedValue instanceof HttpResponse){
    const val = returnedValue as HttpResponse;
    res.status(val.status).json(val.json).end()
  }else{
    res.status(200).json(returnedValue).end()
  }
}
