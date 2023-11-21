import { ExtendedMessageResponse } from "../../chat.response";
import { BaseEvent } from "../../events/base.event";

export class MessageSeenEvent extends BaseEvent {
  message: ExtendedMessageResponse;

  chatId: number;
}
