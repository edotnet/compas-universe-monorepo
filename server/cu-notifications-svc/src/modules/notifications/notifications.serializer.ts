import {
  GetNotificationsResponse,
  Notifications,
  mapNotificationToNotificationResponse,
} from '@edotnet/shared-lib';

export const mapNotificationsToGetNotificationsResponse = (
  notifications: Notifications[],
  count: number,
): GetNotificationsResponse => ({
  unReadNotificationsCount: count,
  notifications: notifications.map(mapNotificationToNotificationResponse),
});
