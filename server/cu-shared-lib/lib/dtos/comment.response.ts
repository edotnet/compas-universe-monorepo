import { IsNotEmpty } from "class-validator";
import { PostComment } from "../entities";
import { UserResponse, mapUserToUserResponse } from "./user.response";

export class CommentResponse {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  postId: number;

  @IsNotEmpty()
  user: UserResponse;

  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  replyTo?: number;
}

export class CommentExtendedResponse extends CommentResponse {
  @IsNotEmpty()
  liked: boolean;

  @IsNotEmpty()
  replyCount?: number;

  @IsNotEmpty()
  replies?: CommentExtendedResponse[];
}

export const mapCommentToCommentResponse = (
  comment: PostComment
): CommentResponse => ({
  id: comment.id,
  postId: comment.post.id,
  content: comment.content,
  createdAt: comment.createdAt,
  user: mapUserToUserResponse(comment.user),
  ...(comment.replyTo && { replyTo: comment.replyTo.id }),
});
