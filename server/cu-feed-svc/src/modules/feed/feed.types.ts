import { Nullable } from '@edotnet/shared-lib';

export class UserQueryResponse {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  profilePicture: Nullable<string>;
}

export class FeedQueryResponse extends UserQueryResponse {
  id: number;
  content: object;
  createdAt: Date;
  commentsCount: number;
  likesCount: number;
  liked: boolean;
  lastCommentId: number;
  lastCommentPostId: number;
  lastCommentCreatedAt: Date;
  lastCommentRepliesCount: number;
  lastCommentContent: string;
  lastCommentUserId: number;
  lastCommentFirstName: string;
  lastCommentLastName: string;
  lastCommentUserName: string;
  lastCommentProfilePicture: Nullable<string>;
  lastCommentLiked: boolean;
}
export class CommentQueryResponse extends UserQueryResponse {
  id: number;
  content: string;
  postId: number;
  createdAt: Date;
  liked: boolean;
  replyToId: number;
  replies: CommentQueryResponse[];
}
