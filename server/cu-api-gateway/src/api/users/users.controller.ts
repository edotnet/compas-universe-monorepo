import {
  ChatResponse,
  ComposeAuthorizedDto,
  EmptyResponse,
  FriendRequest,
  FriendRequestRespondRequest,
  USER_FRIENDS_GET,
  USER_ME_GET,
  USER_NON_FRIENDS_GET,
  USER_REQUEST_FRIEND,
  USER_RESPOND_TO_FRIEND_REQUEST,
  USER_UNFRIEND,
  User,
  UserResponse,
  UsersServiceName,
} from '@edotnet/shared-lib';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserGuard } from '../auth/guards/user.guard';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@Inject(UsersServiceName) private readonly client: ClientProxy) {}

  @Get('/me')
  @ApiOkResponse({ type: UserResponse })
  async getMe(@UserGuard() user: User): Promise<UserResponse> {
    return this.client
      .send(USER_ME_GET, ComposeAuthorizedDto(user, {}))
      .toPromise();
  }

  @Post('/request-friend')
  @ApiOkResponse({ type: EmptyResponse })
  async requestFriend(
    @UserGuard() user: User,
    @Body() dto: FriendRequest,
  ): Promise<EmptyResponse> {
    return this.client
      .send(USER_REQUEST_FRIEND, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Post('/respond-friend-request')
  @ApiOkResponse({ type: EmptyResponse })
  async respondFriendRequest(
    @UserGuard() user: User,
    @Body() dto: FriendRequestRespondRequest,
  ): Promise<EmptyResponse> {
    return this.client
      .send(USER_RESPOND_TO_FRIEND_REQUEST, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Post('/unfriend')
  @ApiOkResponse({ type: EmptyResponse })
  async unfriend(
    @UserGuard() user: User,
    @Body() dto: FriendRequest,
  ): Promise<EmptyResponse> {
    return this.client
      .send(USER_UNFRIEND, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Get('/friends')
  @ApiOkResponse({ type: UserResponse, isArray: true })
  async getFriends(@UserGuard() user: User): Promise<UserResponse[]> {
    return this.client
      .send(USER_FRIENDS_GET, ComposeAuthorizedDto(user, {}))
      .toPromise();
  }

  @Get('/non-friends')
  @ApiOkResponse({ type: UserResponse, isArray: true })
  async getNonFriends(@UserGuard() user: User): Promise<UserResponse[]> {
    return this.client
      .send(USER_NON_FRIENDS_GET, ComposeAuthorizedDto(user, {}))
      .toPromise();
  }
}
