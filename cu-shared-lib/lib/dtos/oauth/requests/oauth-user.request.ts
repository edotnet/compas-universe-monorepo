import { IsEmail, IsEnum, IsString } from "class-validator";
import { OAuthProviders } from "../../../entities";
import { Type } from "class-transformer";

export class OauthUserRequest {
  @IsEnum(OAuthProviders)
  provider: OAuthProviders;

  @IsString()
  @Type(() => String)
  providerId: string;

  @IsEmail()
  email: string;

  @IsString()
  @Type(() => String)
  firstName: string;

  @IsString()
  @Type(() => String)
  lastName: string;

  @IsString()
  @Type(() => String)
  extra: string;
}
