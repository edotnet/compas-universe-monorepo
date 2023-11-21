import { ExtendedMessageResponse } from "../../chat.response";
import { BaseEvent } from "../../events/base.event";

export class MessageEvent extends BaseEvent {
  message: ExtendedMessageResponse;

  chatId: number;

  inChat: boolean
}
