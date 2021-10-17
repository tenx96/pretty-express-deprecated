import {ValidationError } from "class-validator"
import {HttpErrorResponse} from "../models"
import {Request, Response, NextFunction} from "express"
export type ValidationErrorHandler = (err : ValidationError[] , request : Request, response : Response , next : NextFunction) => void;
export type ResponseValidationError = (err : ValidationError[]) => void;
export type AuthenticationErrorHandler = (requiredRoles : string[],err : Error , request : Request, response : Response , next : NextFunction) => void;
export type HttpErrorResponseHandler = (err : HttpErrorResponse, request : Request, response : Response , next : NextFunction) => void;
