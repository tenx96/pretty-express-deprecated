import "reflect-metadata";
import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import { AUTH_CREDENTIAL_KEY } from "./keys";
import { JwtAuthenticationStrategy } from "./services/authentication.service";
import { ValidationService } from "./services/validation.interface";
import { ServerValidationService } from "./services/validation.service";

import { HttpResponse } from "./models/httpresponse";
import { buildHttpErrorMiddleware } from "./services/errorMiddleware";
import {
  IControllerMetaData,
  IFunctionMetaData,
  IRouterData,
} from "./interfaces";
import {
  getDataFromAuthenticationStrategy,
  getDataFromControllerClass,
  getDataFromAllDecoratedFunction,
  getAuthenticationMiddleware,
  executeFucntionWithDecoratedArguments,
} from "./helpers";

import {
  ValidationErrorHandler,
  AuthenticationErrorHandler,
  HttpErrorResponseHandler,
} from "./interfaces";
import { ValidationError } from "class-validator";

export class Server {
  private authStrategies: Map<string, JwtAuthenticationStrategy>;
  private validationService: ValidationService;

  private requestValidationErrorHandler: ValidationErrorHandler;
  private responseValidationErrorHandler: ValidationErrorHandler;
  private authenticationErrorHandler: AuthenticationErrorHandler;
  private httpErrorResponseHandler: HttpErrorResponseHandler;

  constructor(protected _app: Express) {
    this.authStrategies = new Map();
    this.validationService = new ServerValidationService();
  }

  // add setters for error handlers

  public replaceRequestValidationErrorHandler(
    handler: ValidationErrorHandler
  ): void {
    this.requestValidationErrorHandler = handler;
  }

  public replaceResponseValidationErrorHandler(
    handler: ValidationErrorHandler
  ): void {
    this.responseValidationErrorHandler = handler;
  }

  public replaceAuthErrorHandler(handler: AuthenticationErrorHandler): void {
    this.authenticationErrorHandler = handler;
  }

  public replaceHttpErrorResponseHandler(
    handler: HttpErrorResponseHandler
  ): void {
    this.httpErrorResponseHandler = handler;
  }

  /**
   *
   * @param controllerList list of controllers marked with @controller
   */

  public addControllersToServer(controllerList: Object[]): void {
    try {
      controllerList.forEach((controller) => {
        const controllerData = getDataFromControllerClass(controller);

        const functionsData = getDataFromAllDecoratedFunction(controller);

        const routerData = this.buildRouterForController(
          functionsData,
          controllerData,
          controller,
          this.authStrategies,
          this.validationService
        );

        this._app.use(routerData.baseUrl, routerData.router);
      });

      // add base error handler
      this._app.use(buildHttpErrorMiddleware(this.httpErrorResponseHandler));
    } catch (err) {
      console.log("Error adding controllers to server");
      throw err;
    }
  }

  /**
   *
   * @param strategyList get list of strategies that extends our authentication class
   */
  public addAuthenticationStrategies(
    strategyList: JwtAuthenticationStrategy[]
  ): void {
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
  public replaceValidationService(service: ValidationService) {
    this.validationService = service;
  }

  /**
   *
   * @param functionMetaData
   * @param controllerMetaData
   * @param controller
   * @returns build a router with given meta data
   */

  private buildRouterForController(
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
        authStrategies,
        this.authenticationErrorHandler
      );

      if (authMiddleware) {
        router.use(authMiddleware);
      }

      // attach class level/controller middlewares
      if (controllerMetaData.middlewares.length != 0) {
        router.use(...controllerMetaData.middlewares);
      }

      // attach controller level validator
      if (
        controllerMetaData.validationData &&
        controllerMetaData.validationData.schema
      ) {
        const { schema, options } = controllerMetaData.validationData;
        router.use(validationService.validationMiddleware(schema, options));
      }

      functionMetaData.forEach((fdata) => {
        const fullpath = fdata.path;
        // create RouteHandler

        // extract authData

        const funcAuthMiddleware = getAuthenticationMiddleware(
          fdata.authData,
          authStrategies,
          this.authenticationErrorHandler
        );
        if (funcAuthMiddleware) {
          // add auth middleware to the beggining of the middleware list
          fdata.middlewares.unshift(funcAuthMiddleware);
        }

        // add request level middlewares
        if (fdata.validationData && fdata.validationData.schema) {
          const { schema, options } = fdata.validationData;

          fdata.middlewares.push(
            validationService.validationMiddleware(schema, options)
          );
        }

        router[fdata.httpMethod](
          fullpath,
          ...fdata.middlewares,
          async (request: any, response: Response, next: NextFunction) => {
            try {
              const { body, params, query } = request;
              const authUser = request[AUTH_CREDENTIAL_KEY];

              const returnedVal = await executeFucntionWithDecoratedArguments(
                controller,
                fdata.propertyKey,
                { arg: fdata.parameterIndex, body, params, authUser, query },
                { request, response, next }
              );

              // handle returned value based on type of returned object, : obj or HttpResponse or HttpErrorResponse
              // also checks if Response Validator is present and check/validate returned value
              this.handleFunctionReturnValue(
                request,
                response,
                next,
                returnedVal,
                fdata,
                validationService
              );
            } catch (err) {
              next(err);
            }
          },
          ...fdata.errorMiddlewares
        );
      });

      // attatch error middlewares
      if (validationService) {
        router.use(
          validationService.validationErrorHandler(
            this.requestValidationErrorHandler
          )
        );
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

  /**
   *
   * @param req express request
   * @param res express response
   * @param next express next func
   * returns 200 res by default. if returned value is of custom type `HttpResponse` handle it accordingly
   */
  private handleFunctionReturnValue(
    req: Request,
    res: Response,
    next: NextFunction,
    returnedValue: Object | HttpResponse,
    funcData: IFunctionMetaData,
    validationService: ValidationService
  ): void {
    let data: Object;

    if (returnedValue instanceof HttpResponse) {
      data = (returnedValue as HttpResponse).json;
    } else {
      data = returnedValue;
    }

    if (
      funcData &&
      funcData.resValidationData &&
      funcData.resValidationData.schema
    ) {
      const { schema, options, onError } = funcData.resValidationData;
      const result = validationService.validateResponseObject(
        schema,
        data,
        options,
        onError
      );

      if (result instanceof Array && result[0] instanceof ValidationError) {
        // handler error
        if (this.responseValidationErrorHandler) {
          return this.responseValidationErrorHandler(result, req, res, next);
        } else {
          /** @TODO this maybe changed to log*/
          throw new Error(result.toString());
        }
      } else {
        data = result;
      }
    }

    if (returnedValue instanceof HttpResponse) {
      const val = returnedValue as HttpResponse;
      res.status(val.status).json(data).end();
    } else {
      res.status(200).json(data).end();
    }
  }
}
