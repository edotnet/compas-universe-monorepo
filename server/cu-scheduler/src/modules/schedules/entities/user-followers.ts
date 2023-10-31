import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { BasePostgresModel } from "./base.entity";

@Entity("user-followers")
export class UserFollower extends BasePostgresModel {
  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn()
  following: User;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn()
  follower: User;
}
