import {
  ComposeAuthorizedDto,
  EmptyResponse,
  FollowRequest,
  USER_FOLLOW,
  USER_FOLLOWINGS_GET,
  USER_ME_GET,
  USER_NON_FOLLOWINGS_GET,
  USER_UNFOLLOW,
  User,
  UserResponse,
  UsersServiceName,
} from '@edotnet/shared-lib';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
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

  @Post('/follow')
  @ApiOkResponse({ type: EmptyResponse })
  async follow(
    @UserGuard() user: User,
    @Body() dto: FollowRequest,
  ): Promise<EmptyResponse> {
    return this.client
      .send(USER_FOLLOW, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Post('/unfollow')
  @ApiOkResponse({ type: EmptyResponse })
  async unfollow(
    @UserGuard() user: User,
    @Body() dto: FollowRequest,
  ): Promise<EmptyResponse> {
    return this.client
      .send(USER_UNFOLLOW, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Get('/followings')
  @ApiOkResponse({ type: UserResponse, isArray: true })
  async getFollowings(@UserGuard() user: User): Promise<UserResponse[]> {
    return this.client
      .send(USER_FOLLOWINGS_GET, ComposeAuthorizedDto(user, {}))
      .toPromise();
  }

  @Get('/non-followings')
  @ApiOkResponse({ type: UserResponse, isArray: true })
  async getNonFollowings(@UserGuard() user: User): Promise<UserResponse[]> {
    return this.client
      .send(USER_NON_FOLLOWINGS_GET, ComposeAuthorizedDto(user, {}))
      .toPromise();
  }
}
