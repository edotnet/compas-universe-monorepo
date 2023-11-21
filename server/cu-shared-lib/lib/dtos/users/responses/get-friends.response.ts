import { IsNotEmpty } from "class-validator";
import { UserResponse } from "../../user.response";

export class GetFriendsResponse extends UserResponse {
  @IsNotEmpty()
  isFriend: boolean;

  @IsNotEmpty()
  me: boolean;
}
