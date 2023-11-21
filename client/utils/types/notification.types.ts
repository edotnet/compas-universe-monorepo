export enum NotificationsTypes {
  FRIEND_REQUEST = "FRIEND_REQUEST",
}

export interface INotification {
  id: number;
  createdAt: Date;
  type: NotificationsTypes;
  read: boolean;
  content: object;
}
