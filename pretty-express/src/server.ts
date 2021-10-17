import { Express, NextFunction, Request, Response, Router } from "express";
import "reflect-metadata";
import {
  executeFucntionWithDecoratedArguments,
  getAuthenticationMiddleware,
  getDataFromAllDecoratedFunction,
  getDataFromAuthenticationStrategy,
  getDataFromControllerClass,
} from "./helpers";
import {
  AuthenticationErrorHandler,
  HttpErrorResponseHandler,
  IControllerMetaData,
  IFunctionMetaData,
  IRouterData,
  ResponseValidationError,
  ValidationErrorHandler,
} from "./interfaces";
import { AUTH_CREDENTIAL_KEY } from "./keys";
import { HttpResponse } from "./models/httpresponse";
import { JwtAuthenticationStrategy } from "./services/authentication.service";
import { buildHttpErrorMiddleware } from "./services/errorMiddleware";
import { ServerValidationService } from "./services/validation.service";
import { ValidatorOptions } from "class-validator";
import { ClassTransformOptions } from "class-transformer";

export declare type ResponseTransformOptions = {
  validate?: boolean;
  transformOptions?: ClassTransformOptions;
  validatorOptions?: ValidatorOptions;
};
export class Server {
  private authStrategies: Map<string, JwtAuthenticationStrategy>;
  private validationService: ServerValidationService;
  private validatorOptions: ValidatorOptions;
  private requestValidationErrorHandler: ValidationErrorHandler;
  private responseValidationErrorHandler: ResponseValidationError;
  private authenticationErrorHandler: AuthenticationErrorHandler;
  private httpErrorResponseHandler: HttpErrorResponseHandler;
  private responseTransformValidateOptions: ResponseTransformOptions;

  constructor(protected _app: Express) {
    this.authStrategies = new Map();
    this.validationService = new ServerValidationService();
  }

  // add setters for error handlers

  public setTransformOptions(options: ResponseTransformOptions): void {
    this.responseTransformValidateOptions = options;
  }

  public setValidatorOptions(options: ValidatorOptions) {
    this.validatorOptions = options;
  }

  public onRequestValidationError(
    handler: ValidationErrorHandler
  ): void {
    this.requestValidationErrorHandler = handler;
  }

  public onResponseValidationError(
    handler: ResponseValidationError
  ): void {
    this.responseValidationErrorHandler = handler;
  }

  public onAuthenticationError(handler: AuthenticationErrorHandler): void {
    this.authenticationErrorHandler = handler;
  }

  public onHttpErrorResponse(
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
    validationService: ServerValidationService
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
        router.use(
          validationService.validationMiddleware(
            schema,
            options || this.validatorOptions
          )
        );
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
            validationService.validationMiddleware(
              schema,
              options || this.validatorOptions
            )
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
    validationService: ServerValidationService
  ): void {
    let data: Object;

    if (returnedValue instanceof HttpResponse) {
      data = (returnedValue as HttpResponse).json;
    } else {
      data = returnedValue;
    }

    if (
      funcData &&
      funcData.resTransformAndValidationData &&
      funcData.resTransformAndValidationData.schema
    ) {
      const { schema, validatorOptions, transformOptions, validate } =
        funcData.resTransformAndValidationData;
      let result;

      // validate if boolean set to true

      if (
        validate ||
        (this.responseTransformValidateOptions &&
          this.responseTransformValidateOptions.validate)
      ) {
        try {
          result = validationService.validateResponseObject(
            schema,
            data,
            validatorOptions ||
              (this.responseTransformValidateOptions &&
                this.responseTransformValidateOptions.validatorOptions)
          );
        } catch (err) {
          if (this.responseValidationErrorHandler) {
            this.responseValidationErrorHandler(err);
          } else {
            /** @TODO this maybe changed to log*/
            console.log(err.toString());
          }
        }
      }

      data = this.validationService.transformPlainToClass(
        schema,
        data,
        transformOptions ||
          (this.responseTransformValidateOptions &&
            this.responseTransformValidateOptions.transformOptions)
      );
    }

    if (returnedValue instanceof HttpResponse) {
      const val = returnedValue as HttpResponse;
      res.status(val.status).json(data).end();
    } else {
      res.status(200).json(data).end();
    }
  }
}
