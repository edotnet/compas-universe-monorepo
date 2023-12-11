import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CommentExtendedResponse,
  CommentResponse,
  CreatePostRequest,
  EmptyResponse,
  GetCommentsRequest,
  GetPostRequest,
  Post,
  PostComment,
  PostCommentLike,
  PostCommentRequest,
  PostExtendedResponse,
  PostLike,
  PostLikeRequest,
  PostResponse,
  PostTypes,
  QueryRequest,
  User,
  mapCommentToCommentResponse,
  mapPostToPostResponse,
} from '@edotnet/shared-lib';
import { RpcException } from '@nestjs/microservices';
import { CommentQueryResponse, FeedQueryResponse } from './feed.types';
import {
  mapCommentsToGetCommentsResponse,
  mapPostsToGetPostsResponse,
} from './feed.serializer';

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

  async getFeed(
    userId: number,
    dto: QueryRequest,
  ): Promise<PostExtendedResponse[]> {
    const posts: FeedQueryResponse[] = await this.postRepository.query(
      `
      WITH RankedComments AS (
        SELECT
          pc."postId" AS "postId",
          pc."id",
          pc."createdAt" AS "createdAt",
          pc."content",
          upc."userId" AS "userId",
          upc."firstName" AS "firstName",
          upc."lastName" AS "lastName",
          upc."userName" AS "userName",
          upc."profilePicture" AS "profilePicture",
          (
            SELECT COUNT(*)
            FROM 
              "post-comments" reply 
              LEFT JOIN "user-profiles" upr ON upr."userId" = reply."userId" 
            WHERE 
              reply."replyToId" = pc.id 
              AND reply.deleted = false
          )::INTEGER AS "commentsCount", 
          CASE WHEN EXISTS (
            SELECT
              *
            FROM 
              "post-comment-likes" pcl
            WHERE
              pcl."commentId" = pc.id AND pcl.deleted = false AND pcl."userId" = $1
          ) THEN TRUE ELSE FALSE END AS liked,
          ROW_NUMBER() OVER (PARTITION BY pc."postId" ORDER BY pc."createdAt" DESC) AS rn
        FROM
          "post-comments" pc
          LEFT JOIN 
            "user-profiles" upc ON upc."userId" = pc."userId"
        WHERE
          pc.deleted = false AND pc."replyToId" IS NULL
      )
      SELECT
        p.id AS id,
        p.content AS content,
        p."createdAt" AS "createdAt",
        (
          SELECT COUNT(*)
          FROM "post-comments" pc
          WHERE pc."postId" = p.id AND pc.deleted = false
        )::INTEGER AS "commentsCount",
        (
          SELECT COUNT(*)
          FROM "post-likes" pl
          WHERE pl."postId" = p.id AND pl.deleted = false
        )::INTEGER AS "likesCount",
        p."userId",
        up."firstName" AS "firstName",
        up."lastName" AS "lastName",
        up."userName" AS "userName",
        up."profilePicture" AS "profilePicture",
        CASE WHEN EXISTS (
          SELECT
            *
          FROM 
            "post-likes" pl
          WHERE
            pl."postId" = p.id AND pl.deleted = false AND pl."userId" = $1
        ) THEN TRUE ELSE FALSE END AS liked,
        rc.id AS "lastCommentId",
        rc."createdAt" AS "lastCommentCreatedAt",
        rc.content AS "lastCommentContent",
        rc."userId" AS "lastCommentUserId",
        rc."firstName" AS "lastCommentFirstName",
        rc."lastName" AS "lastCommentLastName",
        rc."userName" AS "lastCommentUserName",
        rc."profilePicture" AS "lastCommentProfilePicture",
        rc."commentsCount" AS "lastCommentRepliesCount",
        rc."liked" AS "lastCommentLiked",
        rc."postId" AS "lastCommentPostId"
      FROM
        "posts" p
        JOIN "user-profiles" up ON up."userId" = p."userId"
        LEFT JOIN RankedComments rc ON rc."postId" = p.id AND rc.rn = 1
        LEFT JOIN "user-friends" uf ON uf."userId" = $1
      WHERE 
        p."userId" = uf."friendId" OR p."userId" = $1 
      GROUP BY
        p.id, 
        up.id, 
        rc."id", 
        rc.content, 
        rc."liked",
        rc."postId",
        rc."userId", 
        rc."lastName",
        rc."userName",
        rc."createdAt", 
        rc."firstName",
        rc."commentsCount",
        rc."profilePicture"
      ORDER BY 
        p."createdAt" DESC
      OFFSET $2
      LIMIT $3;      
      `,
      [userId, dto.skip, dto.take],
    );

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
  ): Promise<CommentResponse> {
    const post = await this.postRepository.findOne({
      where: {
        id: dto.postId,
      },
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!post) {
      throw new RpcException({
        httpStatus: HttpStatus.BAD_REQUEST,
        message: 'POST_NOT_FOUND',
      });
    }

    const newComment = new PostComment();

    newComment.user = user;
    newComment.post = post;
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

    const comment = await this.postCommentRepository.save(newComment);

    return mapCommentToCommentResponse(comment);
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

  async getPost(
    userId: number,
    dto: GetPostRequest,
  ): Promise<PostExtendedResponse> {
    const post: FeedQueryResponse[] = await this.postRepository.query(
      `
      SELECT
        p.id AS id,
        p.content AS content,
        p."createdAt" AS "createdAt",
        (
          SELECT COUNT(*)
          FROM "post-comments" pc
          WHERE pc."postId" = p.id AND pc.deleted = false
        )::INTEGER AS "commentsCount",
        (
          SELECT COUNT(*)
          FROM "post-likes" pl
          WHERE pl."postId" = p.id AND pl.deleted = false
        )::INTEGER AS "likesCount",
        p."userId",
        up."firstName" AS "firstName",
        up."lastName" AS "lastName",
        up."userName" AS "userName",
        up."profilePicture" AS "profilePicture",
        CASE WHEN EXISTS (
          SELECT
            *
          FROM 
            "post-likes" pl
          WHERE
            pl."postId" = p.id AND pl.deleted = false AND pl."userId" = $2
        ) THEN TRUE ELSE FALSE END AS liked
      FROM
        "posts" p
      JOIN 
        "user-profiles" up ON up."userId" = p."userId"
      WHERE
        p.id = $1
      GROUP BY
        p.id, 
        up.id
      ORDER BY 
        p."createdAt" DESC
      OFFSET $3
      LIMIT $4;     
      `,
      [dto.postId, userId, dto.skip, dto.take],
    );

    return mapPostsToGetPostsResponse(post)[0];
  }

  async getComments(
    userId: number,
    dto: GetCommentsRequest,
  ): Promise<CommentExtendedResponse[]> {
    const comments: CommentQueryResponse[] =
      await this.postCommentRepository.query(
        `
      SELECT 
      pc.id, 
      pc.content, 
      pc."postId", 
      pc."replyToId", 
      pc."createdAt", 
      up."userId", 
      up."firstName", 
      up."lastName", 
      up."userName", 
      up."profilePicture", 
      CASE WHEN EXISTS (
        SELECT 
        * 
        FROM 
        "post-comment-likes" pcl 
        WHERE 
        pcl."commentId" = pc.id 
        AND pcl.deleted = false 
        AND pcl."userId" = $2
        ) THEN TRUE ELSE FALSE END AS liked, 
        COALESCE(
          (
            SELECT 
            json_agg(
              jsonb_build_object(
                'id', 
                reply.id, 
                'content', 
                reply.content, 
                'createdAt', 
                reply."createdAt", 
                  'userId', 
                  reply."userId", 
                  'firstName', 
                  upr."firstName", 
                  'lastName', 
                  upr."lastName", 
                  'userName', 
                  upr."userName", 
                  'profilePicture', 
                  upr."profilePicture", 
                  'liked', 
                  CASE WHEN EXISTS (
                    SELECT 
                    * 
                    FROM 
                    "post-comment-likes" pcl 
                    WHERE 
                    pcl."commentId" = reply.id 
                    AND pcl.deleted = false 
                    AND pcl."userId" = $2
                  ) THEN TRUE ELSE FALSE END
                  )
                  ) 
                  FROM 
                  "post-comments" reply 
                  LEFT JOIN "user-profiles" upr ON upr."userId" = reply."userId" 
                  WHERE 
                  reply."replyToId" = pc.id 
                  AND reply.deleted = false
                  ), 
                  '[]'
                  ) AS replies 
                  FROM 
                  "post-comments" pc 
                  LEFT JOIN 
                  "posts" p ON pc."postId" = p."id" 
                  LEFT JOIN 
                  "user-profiles" up ON up."userId" = pc."userId" 
                  WHERE 
                  p."id" = $1 AND pc."replyToId" IS NULL
                  ORDER BY 
                  pc."createdAt" DESC 
                  OFFSET $3 
                  LIMIT $4;
                  `,
        [dto.postId, userId, dto.skip, dto.take],
      );

    return mapCommentsToGetCommentsResponse(comments);
  }
}
