import { ValidationError, ValidatorOptions } from "class-validator";
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
  resValidationData?: IResponseValidationData;
  parameterIndex: IParameterDetails;
}

export interface IAuthenticationStrategyMetaData {
  name: string;
}

export interface IParameterDetails {
  requestBody: number;
  requestParams: number;
  authUser: number;
  requestQuery: number;
}

export interface IAuthenticationData {
  strategy: string;
  role: string[];
}

export interface IValidationData {
  schema: any;
  options?: ValidatorOptions;
}

export interface IResponseValidationData {
  schema: any;
  options?: ValidatorOptions;
  onError?: (err: ValidationError[]) => void;
}
