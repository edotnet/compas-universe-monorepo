import { ExtendedMessageResponse } from "../../chat.response";
import { BaseEvent } from "../../events/base.event";
import { UserResponse } from "../../user.response";

export class MessageEvent extends BaseEvent {
  user: UserResponse;

  message: ExtendedMessageResponse;

  chatId: number
}
