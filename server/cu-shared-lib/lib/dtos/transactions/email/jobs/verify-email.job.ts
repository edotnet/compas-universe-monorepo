import { IsNotEmpty, IsString } from "class-validator";
import { EmailBaseJob } from "../../../../jobs";
import { Type } from "class-transformer";

export class VerifyEmailJob extends EmailBaseJob {
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  code: string;
}
