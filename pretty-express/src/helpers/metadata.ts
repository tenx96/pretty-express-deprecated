import { IAuthenticationStrategyMetaData, IControllerMetaData, IFunctionMetaData } from "../interfaces";
import { AUTH_META_KEYS, CONTROLLER_META_KEYS, FUNCTION_META_KEYS, HTTP_METHOD, MIDDLEWARE_META_KEYS, PARAMETER_META_KEYS, VALIDATOR_META_KEYS } from "../keys";

/**
 *
 * @param strategy name of the strategy
 * @returns returns the name of the auth service marked with @AuthStrategy
 */
export function getDataFromAuthenticationStrategy(
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

 export function getDataFromControllerClass(controller: Object): IControllerMetaData {
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
        Reflect.getOwnMetadata(AUTH_META_KEYS.role, prototype) || [];
  
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

export function getDataFromAllDecoratedFunction(
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
  
        // check for parameter indexes
        const requestBodyArgIndex = Reflect.getOwnMetadata(
          PARAMETER_META_KEYS.requestBody,
          prototype,
          propertyKey
        );
  
        const requestParamsArgIndex = Reflect.getOwnMetadata(
          PARAMETER_META_KEYS.requestParams,
          prototype,
          propertyKey
        );
  
        const authUserArgIndex = Reflect.getOwnMetadata(
          PARAMETER_META_KEYS.authUser,
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
            parameterIndex: {
              authUser: authUserArgIndex,
              requestBody: requestBodyArgIndex,
              requestParams: requestParamsArgIndex,
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
  
  
