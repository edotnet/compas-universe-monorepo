import { IsEmail, IsString } from "class-validator";
import { IsPassword } from "../../../decorator";

export class ValidateUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsPassword()
  password: string;
}
