import { RequestHandler } from "express";
import { IAuthenticationData } from "../interfaces";
import { JwtAuthenticationStrategy } from "../services";


export function getAuthenticationMiddleware(
    authData: IAuthenticationData,
    authStrategies: Map<string, JwtAuthenticationStrategy>
  )  : RequestHandler {
    if (authData && authData.strategy) {
      // check if auth strategy is registered at server level
      if (!authStrategies.has(authData.strategy)) {
        throw new Error(
          `Authenticaion Service not registered at Server Level  , name : ${authData.strategy}. addControllersToServer() need to be called after addAuthenticationStrategies `
        );
      } else {
        // strategy exists register middleware
        const authController = authStrategies.get(authData.strategy);
  
        return authController.buildMiddleware(authData.role || []);
      }
    } else {
      // no auth strategy
      return null;
    }
  }