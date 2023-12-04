import { Controller, Inject } from '@nestjs/common';
import { FeedService } from './feed.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  CreatePostRequest,
  EmptyResponse,
  FEED_COMMENT,
  FEED_GET,
  FEED_LIKE,
  FEED_POST_CREATE,
  InjectAuth,
  PostCommentRequest,
  PostExtendedResponse,
  PostLikeRequest,
  PostResponse,
} from '@edotnet/shared-lib';

@Controller()
export class FeedController {
  constructor(@Inject(FeedService) private service: FeedService) {}

  @MessagePattern(FEED_GET)
  async getFeed(): Promise<PostExtendedResponse[]> {
    return this.service.getFeed();
  }

  @MessagePattern(FEED_POST_CREATE)
  async createPost(dto: InjectAuth<CreatePostRequest>): Promise<PostResponse> {
    return this.service.createPost(dto.userId, dto);
  }

  @MessagePattern(FEED_COMMENT)
  async comment(dto: InjectAuth<PostCommentRequest>): Promise<EmptyResponse> {
    return this.service.comment(dto.userId, dto);
  }

  @MessagePattern(FEED_LIKE)
  async like(dto: InjectAuth<PostLikeRequest>): Promise<EmptyResponse> {
    if (dto.commentId) {
      return this.service.commentLike(dto.userId, dto);
    }

    return this.service.postLike(dto.userId, dto);
  }
}
