import { IsEmail, IsString } from "class-validator";
import { IsPassword } from "../../../decorator";

export class ResetPasswordRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsPassword()
  newPassword: string;
}
