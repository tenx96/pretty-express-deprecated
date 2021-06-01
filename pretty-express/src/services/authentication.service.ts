import { Request, Response, NextFunction, RequestHandler } from "express";
import { AUTH_CREDENTIAL_KEY } from "../keys";

export interface UserCredentials {
  email: string;
  id: string;
  role?: string;
}

export abstract class JwtAuthenticationStrategy {
  abstract  generateToken(credentials: UserCredentials | any): Promise<string>;

  abstract verifyToken(token: string): Promise<Object>;

  abstract verifyCredentials(
    credentials: UserCredentials | any , requiredRole? : string[]
  ): Promise<Object>;

  extractToken(req: Request) {
    try {
      if (req.headers.authorization) {
        const strArr = req.headers.authorization.split(" ");

        if (strArr[0] === "Bearer") {
          return strArr[1];
        }
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
    } catch (err) {
      return null;
    }
  }

   buildMiddleware(role? : string[]): RequestHandler {
    return async (req: any, res: Response, next: NextFunction) => {
      try {
        const token = this.extractToken(req).toString();
        const credentials = await this.verifyToken(token);
        const verifiedCredentials = await this.verifyCredentials(credentials , role);
        req[AUTH_CREDENTIAL_KEY] = verifiedCredentials;
        next();
      } catch (err) {
        return res.status(401).json({
          message: err.message || "User Unauthorized",
        });
      }
    };
  }
}
