import { IsNotEmpty, IsEnum } from "class-validator";
import { NotificationsTypes } from "../../../entities";

export class CreateNotificationEvent {
  @IsNotEmpty()
  userId: number;

  @IsEnum(NotificationsTypes)
  @IsNotEmpty()
  type: NotificationsTypes;

  @IsNotEmpty()
  content: object;
}
