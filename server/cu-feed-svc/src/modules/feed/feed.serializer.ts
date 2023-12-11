import {
  CommentExtendedResponse,
  PostExtendedResponse,
} from '@edotnet/shared-lib';
import { CommentQueryResponse, FeedQueryResponse } from './feed.types';

export const mapPostsToGetPostsResponse = (
  posts: FeedQueryResponse[],
): PostExtendedResponse[] =>
  posts.map((p: FeedQueryResponse) => ({
    id: p.id,
    content: p.content,
    commentsCount: p.commentsCount,
    likesCount: p.likesCount,
    createdAt: p.createdAt,
    user: {
      id: p.userId,
      userName: p.userName || `${p.firstName} ${p.lastName}`,
      profilePicture: p.profilePicture,
    },
    liked: p.liked,
    lastComment: p.lastCommentId
      ? {
          id: p.lastCommentId,
          content: p.lastCommentContent,
          createdAt: p.lastCommentCreatedAt,
          replyCount: p.lastCommentRepliesCount,
          postId: p.lastCommentPostId,
          user: {
            id: p.lastCommentUserId,
            userName:
              p.lastCommentUserName ||
              `${p.lastCommentFirstName} ${p.lastCommentLastName}`,
            profilePicture: p.lastCommentProfilePicture,
          },
          liked: p.lastCommentLiked,
        }
      : null,
  }));

export const mapCommentsToGetCommentsResponse = (
  comments: CommentQueryResponse[],
): CommentExtendedResponse[] =>
  comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    user: {
      id: c.userId,
      userName: c.userName || `${c.firstName} ${c.lastName}`,
      profilePicture: c.profilePicture,
    },
    replyTo: c.replyToId,
    liked: c.liked,
    postId: c.postId,
    replies: c.replies && mapCommentsToGetCommentsResponse(c.replies),
  }));
