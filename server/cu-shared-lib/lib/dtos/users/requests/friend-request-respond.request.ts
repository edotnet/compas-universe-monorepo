import { IsEnum } from "class-validator";
import { FriendRequest } from "./friend.request";
import { FriendStatus } from "../../../entities";

export class FriendRequestRespondRequest extends FriendRequest {
  @IsEnum(FriendRequest)
  status: FriendStatus;
}
