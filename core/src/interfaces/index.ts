import { ValidatorOptions } from "class-validator";
import { Router } from "express";

export interface IRouterData {
    baseUrl: string;
    router: Router;
  }
  
  /**
   * @type : controller
   * @baseUrl : /users
   */
   export interface IControllerMetaData {
    type: string;
    baseUrl: string;
    middlewares?: Function[];
    errorMiddlewares?: Function[];
    authData?: IAuthenticationData;
    validationData?: IValidationData;
  }
  
  export interface IFunctionMetaData {
    path: string;
    httpMethod: string;
    propertyKey: string;
    middlewares?: Function[];
    errorMiddlewares?: Function[];
    authData?: IAuthenticationData;
    validationData?: IValidationData;
    parameterIndex: IParameterDetails;
  }
  
  export interface IAuthenticationStrategyMetaData {
    name: string;
  }
  
  export interface IParameterDetails {
    requestBody: number;
    requestParams: number;
    authUser: number;
  }
  
  export interface IAuthenticationData {
    strategy: string;
    role: string;
  }
  
  export interface IValidationData {
    schema: any;
    options?: ValidatorOptions;
  }
  