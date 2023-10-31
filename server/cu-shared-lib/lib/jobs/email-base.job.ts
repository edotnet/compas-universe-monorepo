import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export enum MESSAGE_TYPES {
  VERIFY = "VERIFY",
}

export class EmailBaseJob {
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  to: string;
}
