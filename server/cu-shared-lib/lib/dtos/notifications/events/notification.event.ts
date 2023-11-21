import { IsNotEmpty } from "class-validator";
import { BaseEvent } from "../../events/base.event";
import { NotificationResponse } from "../../notification.response";

export class NotificationEvent extends BaseEvent {
  @IsNotEmpty()
  notification: NotificationResponse;
}
