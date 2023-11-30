import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Post } from "./post.entity";
import { BasePostgresModel } from "../base-postgres.entity";
import { User } from "../users";
import { PostCommentLike } from "./post-comment-likes.entity";

@Entity("post-comments")
export class PostComment extends BasePostgresModel {
  @Column()
  content: string;

  @ManyToOne(() => Post)
  @JoinColumn()
  post: Post;

  @ManyToOne(() => PostComment)
  @JoinColumn()
  replyTo: PostComment;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(() => PostCommentLike, (destination) => destination.comment, {
    cascade: true,
  })
  likes: PostCommentLike[];

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;
}
