import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import {
  EmptyRequest,
  EmptyResponse,
  InjectAuth,
  NOTIFICATION_CLEAR,
  NOTIFICATION_READ,
  ReadNotificationsRequest,
} from '@edotnet/shared-lib';

@Controller()
export class NotificationsController {
  constructor(
    @Inject(NotificationsService)
    private notificationsService: NotificationsService,
  ) {}

  @MessagePattern(NOTIFICATION_READ)
  async readNotifications(
    readNotificationsDto: InjectAuth<ReadNotificationsRequest>,
  ): Promise<EmptyResponse> {
    return this.notificationsService.readNotifications(
      readNotificationsDto.userId,
      readNotificationsDto,
    );
  }

  @MessagePattern(NOTIFICATION_CLEAR)
  async clearNotifications(
    clearNotificationsDto: InjectAuth<EmptyRequest>,
  ): Promise<EmptyResponse> {
    return this.notificationsService.clearNotifications(
      clearNotificationsDto.userId,
    );
  }
}
