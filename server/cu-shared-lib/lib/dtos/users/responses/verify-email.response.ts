import { Type } from "class-transformer";
import { IsBoolean } from "class-validator";

export class VerifyEmailResponse {
  @IsBoolean()
  @Type(() => Boolean)
  verify: boolean;
}
