import { IsNotEmpty } from "class-validator";
import { Post } from "../entities";
import { UserResponse, mapUserToUserResponse } from "./user.response";

export class PostResponse {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  content: object;

  @IsNotEmpty()
  user: UserResponse;

  @IsNotEmpty()
  createdAt: Date;
}

export class PostExtendedResponse extends PostResponse {
  @IsNotEmpty()
  commentsCount: number;

  @IsNotEmpty()
  likesCount: number;
}

export const mapPostToPostResponse = (post: Post): PostResponse => ({
  id: post.id,
  content: post.content,
  user: mapUserToUserResponse(post.user),
  createdAt: post.createdAt,
});
