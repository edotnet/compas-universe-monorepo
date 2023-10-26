import { Type } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class VerifyEmailRequest {
  @IsEmail()
  email: string;

  @IsString()
  @Type(() => String)
  code: string;
}
