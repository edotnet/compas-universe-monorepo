import { ChatMessages } from "../../../entities";
import { BaseEvent } from "../../events/base.event";
import { UserResponse } from "../../user.response";

export class MessageEvent extends BaseEvent {
  user: UserResponse;

  message: Pick<ChatMessages, "text" | "media" | "seen">;

  userIds: number[];

  chatId: number
}
