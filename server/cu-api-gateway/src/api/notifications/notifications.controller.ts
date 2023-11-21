import {
  ComposeAuthorizedDto,
  EmptyRequest,
  EmptyResponse,
  NOTIFICATION_CLEAR,
  NOTIFICATION_READ,
  NotificationsServiceName,
  ReadNotificationsRequest,
  User,
} from '@edotnet/shared-lib';
import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard';
import { UserGuard } from 'src/api/auth/guards/user.guard';

@ApiTags('notifications')
@Controller('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    @Inject(NotificationsServiceName) private readonly client: ClientProxy,
  ) {}

  @Post('read')
  @ApiOkResponse({ type: EmptyResponse })
  async readNotifications(
    @UserGuard() user: User,
    @Body() dto: ReadNotificationsRequest,
  ): Promise<EmptyResponse> {
    return this.client
      .send(NOTIFICATION_READ, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Delete('clear')
  @ApiOkResponse({ type: EmptyResponse })
  async clearNotifications(
    @UserGuard() user: User,
    @Body() dto: EmptyRequest,
  ): Promise<EmptyResponse> {
    return this.client
      .send(NOTIFICATION_CLEAR, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }
}
