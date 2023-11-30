import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BasePostgresModel } from "../base-postgres.entity";
import { PostComment } from "./post-comment.entity";
import { User } from "../users";

@Entity("post-comment-likes")
export class PostCommentLike extends BasePostgresModel {
  @ManyToOne(() => PostComment)
  @JoinColumn()
  comment: PostComment;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @Column({ default: false })
  deleted: boolean;
}
