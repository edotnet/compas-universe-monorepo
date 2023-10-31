import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { BasePostgresModel } from "../base-postgres.entity";

@Entity("user-followers")
export class UserFollower extends BasePostgresModel {
  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn()
  following: User;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn()
  follower: User;
}
