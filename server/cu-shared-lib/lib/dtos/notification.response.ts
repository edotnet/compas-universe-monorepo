import { IsNotEmpty } from "class-validator";
import { Notifications, NotificationsTypes } from "../entities";

export class NotificationResponse {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  createdAt: Date;
  
  @IsNotEmpty()
  type: NotificationsTypes;

  @IsNotEmpty()
  read: boolean;

  @IsNotEmpty()
  content: object;
}

export const mapNotificationToNotificationResponse = (
  notifications: Notifications
): NotificationResponse => ({
  id: notifications.id,
  createdAt: notifications.createdAt,
  type: notifications.type,
  read: notifications.read,
  content: notifications.content,
});
