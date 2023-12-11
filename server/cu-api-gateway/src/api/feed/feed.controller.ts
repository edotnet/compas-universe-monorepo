import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  QueryRequest,
  FEED_COMMENTS_GET,
  CommentResponse,
  CommentExtendedResponse,
  GetPostRequest,
  FEED_POST_GET,
} from '@edotnet/shared-lib';

@Controller('feed')
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(@Inject(FeedServiceName) private readonly client: ClientProxy) {}

  @Get()
  async getFeed(
    @UserGuard() user: User,
    @Query() dto: QueryRequest,
  ): Promise<PostExtendedResponse[]> {
    return this.client
      .send(FEED_GET, ComposeAuthorizedDto(user, dto))
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
  ): Promise<CommentResponse> {
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

  @Get('/:postId')
  async getPost(
    @UserGuard() user: User,
    @Param() dto: GetPostRequest,
  ): Promise<PostExtendedResponse> {
    return this.client
      .send(FEED_POST_GET, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Get('/:postId/comments')
  async getComments(
    @UserGuard() user: User,
    @Param('postId') postId: number,
    @Query() dto: QueryRequest,
  ): Promise<CommentExtendedResponse[]> {
    return this.client
      .send(FEED_COMMENTS_GET, ComposeAuthorizedDto(user, { ...dto, postId }))
      .toPromise();
  }
}
