import { Controller, Inject } from '@nestjs/common';
import { FeedService } from './feed.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  CommentExtendedResponse,
  CommentResponse,
  CreatePostRequest,
  EmptyRequest,
  EmptyResponse,
  FEED_COMMENT,
  FEED_COMMENTS_GET,
  FEED_GET,
  FEED_LIKE,
  FEED_POST_CREATE,
  FEED_POST_GET,
  GetCommentsRequest,
  GetPostRequest,
  InjectAuth,
  PostCommentRequest,
  PostExtendedResponse,
  PostLikeRequest,
  PostResponse,
  QueryRequest,
} from '@edotnet/shared-lib';

@Controller()
export class FeedController {
  constructor(@Inject(FeedService) private service: FeedService) {}

  @MessagePattern(FEED_GET)
  async getFeed(
    dto: InjectAuth<QueryRequest>,
  ): Promise<PostExtendedResponse[]> {
    return this.service.getFeed(dto.userId, dto);
  }

  @MessagePattern(FEED_POST_CREATE)
  async createPost(dto: InjectAuth<CreatePostRequest>): Promise<PostResponse> {
    return this.service.createPost(dto.userId, dto);
  }

  @MessagePattern(FEED_COMMENT)
  async comment(dto: InjectAuth<PostCommentRequest>): Promise<CommentResponse> {
    return this.service.comment(dto.userId, dto);
  }

  @MessagePattern(FEED_LIKE)
  async like(dto: InjectAuth<PostLikeRequest>): Promise<EmptyResponse> {
    if (dto.commentId) {
      return this.service.commentLike(dto.userId, dto);
    }

    return this.service.postLike(dto.userId, dto);
  }

  @MessagePattern(FEED_POST_GET)
  async getPost(
    dto: InjectAuth<GetPostRequest>,
  ): Promise<PostExtendedResponse> {
    return this.service.getPost(dto.userId, dto);
  }

  @MessagePattern(FEED_COMMENTS_GET)
  async getComments(
    dto: InjectAuth<GetCommentsRequest>,
  ): Promise<CommentExtendedResponse[]> {
    return this.service.getComments(dto.userId, dto);
  }
}
