import {
  CreateNotificationEvent,
  EmptyResponse,
  EventsManagerService,
  GetNotificationsResponse,
  NOTIFICATION_NEW_EVENT,
  NotificationEvent,
  Notifications,
  QueryRequest,
  ReadNotificationsRequest,
  User,
  mapNotificationToNotificationResponse,
} from '@edotnet/shared-lib';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { mapNotificationsToGetNotificationsResponse } from './notifications.serializer';
import { isUndefined } from 'lodash';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private notificationsRepository: Repository<Notifications>,
    private readonly eventManager: EventsManagerService,
  ) {}

  async getNotifications(
    userId: number,
    dto: QueryRequest,
  ): Promise<GetNotificationsResponse> {
    const findAndCountNotificationsQueries = this.findAndCountNotifications(
      userId,
      dto,
      false,
    );

    const [notifications, count] = await Promise.all(
      findAndCountNotificationsQueries,
    );

    return mapNotificationsToGetNotificationsResponse(notifications, count);
  }

  async readNotifications(
    userId: number,
    dto: ReadNotificationsRequest,
  ): Promise<EmptyResponse> {
    return await this.notificationsRepository
      .createQueryBuilder()
      .update(Notifications)
      .set({ read: true })
      .where({ id: In(dto.ids), user: { id: userId } })
      .execute();
  }

  async clearNotifications(userId: number): Promise<EmptyResponse> {
    return await this.notificationsRepository
      .createQueryBuilder()
      .update(Notifications)
      .set({ deleted: true })
      .where({
        user: { id: userId },
      })
      .execute();
  }

  async create(dto: CreateNotificationEvent): Promise<EmptyResponse> {
    const { userId, type, content } = dto;

    const newNotification: Notifications = new Notifications();

    newNotification.user = new User();
    newNotification.user.id = userId;
    newNotification.type = type;
    newNotification.content = content;

    const created = await this.notificationsRepository.save(newNotification);

    this.eventManager.raise(NOTIFICATION_NEW_EVENT, {
      userId,
      notification: mapNotificationToNotificationResponse(created),
    } as NotificationEvent);

    return {};
  }

  private findAndCountNotifications(
    userId: number,
    dto: QueryRequest,
    read?: boolean,
  ): [Promise<Notifications[]>, Promise<number>] {
    const query = {
      user: {
        id: userId,
      },
      deleted: false,
    };

    if (!isUndefined(read)) {
      query['read'] = read;
    }

    return [
      this.notificationsRepository.find({
        where: {
          ...query,
        },
        skip: dto.skip,
        take: dto.take,
        order: {
          createdAt: 'desc',
        },
      }),
      this.notificationsRepository.count({
        where: {
          ...query,
          read: false,
        },
        skip: dto.skip,
        take: dto.take,
        order: {
          createdAt: 'desc',
        },
      }),
    ];
  }
}
