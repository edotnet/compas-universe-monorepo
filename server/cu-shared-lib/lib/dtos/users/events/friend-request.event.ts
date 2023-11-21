import { IsNotEmpty } from "class-validator";
import { BaseEvent } from "../../events/base.event";
import { UserResponse } from "../../user.response";

export class FriendRequestEvent extends BaseEvent {
  @IsNotEmpty()
  friend: UserResponse;
}
