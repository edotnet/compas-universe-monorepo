import { Post } from "./post.entity";
import { PostLike } from "./post-likes.entity";
import { PostComment } from "./post-comment.entity";
import { PostCommentLike } from "./post-comment-likes.entity";

export * from "./post.entity";
export * from "./post-likes.entity";
export * from "./post-comment.entity";
export * from "./post-comment-likes.entity";

export const feedEntitiesPostgres = [
  Post,
  PostLike,
  PostComment,
  PostCommentLike,
];
