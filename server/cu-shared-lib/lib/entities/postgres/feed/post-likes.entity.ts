import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BasePostgresModel } from "../base-postgres.entity";
import { Post } from "./post.entity";
import { User } from "../users";

@Entity("post-likes")
export class PostLike extends BasePostgresModel {
  @ManyToOne(() => Post)
  @JoinColumn()
  post: Post;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @Column({ default: false })
  deleted: boolean;
}
