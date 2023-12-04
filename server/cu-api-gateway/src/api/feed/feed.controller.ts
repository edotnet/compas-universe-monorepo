import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserGuard } from '../auth/guards/user.guard';
import {
  ComposeAuthorizedDto,
  EmptyResponse,
  FeedServiceName,
  User,
  CreatePostRequest,
  FEED_POST_CREATE,
  PostCommentRequest,
  FEED_COMMENT,
  PostLikeRequest,
  FEED_LIKE,
  FEED_GET,
  PostExtendedResponse,
  PostResponse,
} from '@edotnet/shared-lib';

@Controller('feed')
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(@Inject(FeedServiceName) private readonly client: ClientProxy) {}

  @Get()
  async getFeed(@UserGuard() user: User): Promise<PostExtendedResponse[]> {
    return this.client
      .send(FEED_GET, ComposeAuthorizedDto(user, {}))
      .toPromise();
  }

  @Post()
  async createPost(
    @UserGuard() user: User,
    @Body() dto: CreatePostRequest,
  ): Promise<PostResponse> {
    return this.client
      .send(FEED_POST_CREATE, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Post('/comment')
  async comment(
    @UserGuard() user: User,
    @Body() dto: PostCommentRequest,
  ): Promise<EmptyResponse> {
    return this.client
      .send(FEED_COMMENT, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Post('/like')
  async like(
    @UserGuard() user: User,
    @Body() dto: PostLikeRequest,
  ): Promise<EmptyResponse> {
    return this.client
      .send(FEED_LIKE, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }
}
