import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePostRequest,
  EmptyResponse,
  Post,
  PostComment,
  PostCommentLike,
  PostCommentRequest,
  PostExtendedResponse,
  PostLike,
  PostLikeRequest,
  PostResponse,
  PostTypes,
  User,
  mapPostToPostResponse,
} from '@edotnet/shared-lib';
import { RpcException } from '@nestjs/microservices';
import { FeedQueryResponse } from './feed.types';
import { mapPostsToGetPostsResponse } from './feed.serializer';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    @InjectRepository(PostCommentLike)
    private postCommentLikeRepository: Repository<PostCommentLike>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getFeed(): Promise<PostExtendedResponse[]> {
    const posts: FeedQueryResponse[] = await this.postRepository.query(`
    SELECT
      p.id AS id,
      p.content AS content,
      p."createdAt" AS "createdAt",
      COUNT(ps) AS "commentsCount",
      COUNT(pl) AS "likesCount",
      p."userId",
      up."firstName" AS "firstName",
      up."lastName" AS "lastName",
      up."userName" AS "userName",
      up."profilePicture" AS "profilePicture"
    FROM
      "posts" p
    LEFT JOIN 
      "post-comments" ps ON ps."postId" = p.id
    LEFT JOIN 
      "post-likes" pl ON pl."postId" = p.id
    JOIN 
      "user-profiles" up ON up."userId" = p."userId"
    GROUP BY
      p.id, up.id
    ORDER BY 
      p."createdAt" DESC
    `);

    return mapPostsToGetPostsResponse(posts);
  }

  async createPost(
    userId: number,
    dto: CreatePostRequest,
  ): Promise<PostResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    const content = {
      description: dto.description && dto.description,
      ...(dto.media && dto.media.length ? { media: dto.media } : {}),
    };

    const newPost: Post = new Post();

    newPost.content = content;
    newPost.user = user;
    newPost.type = PostTypes.CUSTOM;

    const post = await this.postRepository.save(newPost);

    return mapPostToPostResponse(post);
  }

  async comment(
    userId: number,
    dto: PostCommentRequest,
  ): Promise<EmptyResponse> {
    const post = await this.postRepository.findOne({
      where: {
        id: dto.postId,
      },
    });

    if (!post) {
      throw new RpcException({
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'POST_NOT_FOUND',
      });
    }

    const newComment = new PostComment();

    newComment.user = new User();
    newComment.user.id = userId;
    newComment.post = new Post();
    newComment.post.id = dto.postId;
    newComment.content = dto.content;

    if (dto.commentId) {
      const comment = await this.postCommentRepository.findOne({
        where: {
          id: dto.commentId,
          post: {
            id: dto.postId,
          },
          deleted: false,
        },
      });

      if (!comment) {
        throw new RpcException({
          httpStatus: HttpStatus.BAD_REQUEST,
          message: 'POST_COMMENT_NOT_FOUND',
        });
      }

      newComment.replyTo = new PostComment();
      newComment.replyTo.id = dto.commentId;
    }

    await this.postCommentRepository.save(newComment);

    return {};
  }

  async postLike(userId: number, dto: PostLikeRequest): Promise<EmptyResponse> {
    if (!dto.postId) {
      throw new RpcException({
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'POST_LIKE_POST_ID_REQUIRED',
      });
    }

    const post = await this.postRepository.findOne({
      where: {
        id: dto.postId,
      },
    });

    if (!post) {
      throw new RpcException({
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'POST_NOT_FOUND',
      });
    }

    const postLike = await this.postLikeRepository.findOne({
      where: {
        post: {
          id: dto.postId,
        },
        user: {
          id: userId,
        },
        deleted: false,
      },
    });

    if (postLike) {
      postLike.deleted = true;

      await this.postLikeRepository.save(postLike);

      return;
    }

    const newLike = new PostLike();

    newLike.post = new Post();
    newLike.post.id = dto.postId;
    newLike.user = new User();
    newLike.user.id = userId;

    await this.postLikeRepository.save(newLike);

    return {};
  }

  async commentLike(
    userId: number,
    dto: PostLikeRequest,
  ): Promise<EmptyResponse> {
    if (!dto.commentId) {
      throw new RpcException({
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'POST_LIKE_COMMENT_ID_REQUIRED',
      });
    }

    const comment = await this.postCommentRepository.findOne({
      where: {
        id: dto.commentId,
        deleted: false,
      },
    });

    if (!comment) {
      throw new RpcException({
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'COMMENT_NOT_FOUND',
      });
    }

    const commentLike = await this.postCommentLikeRepository.findOne({
      where: {
        comment: {
          id: dto.commentId,
        },
        user: {
          id: userId,
        },
        deleted: false,
      },
    });

    if (commentLike) {
      commentLike.deleted = true;

      await this.postCommentLikeRepository.save(commentLike);

      return;
    }

    const newLike = new PostCommentLike();

    newLike.comment = new PostComment();
    newLike.comment.id = dto.commentId;
    newLike.user = new User();
    newLike.user.id = userId;

    await this.postCommentLikeRepository.save(newLike);

    return {};
  }
}
