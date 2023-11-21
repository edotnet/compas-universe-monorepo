import { IsNotEmpty } from "class-validator";
import { UserExtendedResponse } from "../../user.response";

export class getUserProfileResponse {
  @IsNotEmpty()
  user: UserExtendedResponse;
  
  @IsNotEmpty()
  isFriend: boolean;
}
