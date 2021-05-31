import { HTTP_METHOD } from "../../keys";
import {
  Controller,
  get,
  post,
  patch,
  del,
  requestBody,
  authenticate,
  validate,
} from "../../";
import { MyJwtAuthService } from "../auth.serv";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { authUser } from "../../";

class Creds {
  @IsString()
  id: string;
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  role?: string;
}

@Controller("/auth")
export class AuthController {
  constructor(private auth: MyJwtAuthService) {}

  @validate(Creds)
  @get("/token")
  async getUsers(@requestBody data: Creds) {
    const { id, email, role } = data;
    const token = await this.auth.generateToken({ id, email, role });
    return { token };
  }

  @authenticate("jwt")
  @post("/protected")
  async protected(@requestBody data: Creds, @authUser auth: any) {
    return { message: "Authenticated ", auth };
  }

  @authenticate("jwt", { role: ["user"] })
  @post("/role")
  async roleProtected(@requestBody data: Creds) {
    return { message: "Recieved a body ", data };
  }

  @authenticate("jwt", { role: ["user", "admin"] })
  @post("/multi")
  async multiroles(@requestBody data: Creds) {
    return { message: "Recieved a body ", data };
  }
}
