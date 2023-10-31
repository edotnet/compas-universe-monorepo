import { IsEmail } from "class-validator";

export class GetUserByEmailRequest {
  @IsEmail()
  email: string;
}
