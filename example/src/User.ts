import { IsEmail, IsString } from "class-validator";

export class UserSchema {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
