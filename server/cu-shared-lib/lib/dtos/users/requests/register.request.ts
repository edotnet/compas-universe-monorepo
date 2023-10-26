import { IsEmail, IsString, Validate } from "class-validator";
import { IsMatch, IsPassword } from "../../../decorator";
import { Type } from "class-transformer";

export class RegisterRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsPassword()
  @Validate(IsMatch("confirmPassword", "password"))
  password: string;

  @IsString()
  @IsPassword()
  @Validate(IsMatch("password", "confirmPassword"))
  confirmPassword: string;

  @IsString()
  @Type(() => String)
  userName: string;
}
