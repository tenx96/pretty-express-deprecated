import { JwtAuthenticationStrategy, AuthStrategy } from "pretty-express";
import jwt from "jsonwebtoken";

const jwtKey = "Auth Key";

export interface UserCredentials {
  id: string;
  email: string;
  role?: string;
}

@AuthStrategy("jwt")
export class MyJwtAuthService extends JwtAuthenticationStrategy {
  async generateToken(credentials: UserCredentials): Promise<string> {
    return await jwt.sign(credentials, jwtKey);
  }
  async verifyToken(token: string): Promise<Object> {
    try {
      const decoded = await jwt.verify(token, jwtKey);
      return decoded;
    } catch (err) {
      throw new Error("An error occured while verifying token");
    }
  }
  async verifyCredentials(
    credentials: UserCredentials,
    requiredRole?: string[]
  ): Promise<Object> {
    try {
      if (requiredRole && requiredRole.length > 0) {
        if (requiredRole.includes(credentials.role)) {
          throw new Error("User is not of required role. Access Denied!");
        }
      }
      return credentials;
    } catch (err) {
      throw err;
    }
  }
}
