import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BasePostgresModel } from "../base-postgres.entity";
import { User } from "../users";
import { PostLike } from "./post-likes.entity";
import { PostComment } from "./post-comment.entity";

export enum PostTypes {
  CUSTOM = "CUSTOM",
}

@Entity("posts")
export class Post extends BasePostgresModel {
  @Column({
    type: "enum",
    enum: PostTypes,
  })
  type: PostTypes;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  content: object;

  @ManyToOne(() => User, (destination) => destination.posts)
  @JoinColumn()
  user: User;

  @OneToMany(() => PostComment, (destination) => destination.post, {
    cascade: true,
  })
  comments: PostComment[];

  @OneToMany(() => PostLike, (destination) => destination.post, {
    cascade: true,
  })
  likes: PostLike[];
}
