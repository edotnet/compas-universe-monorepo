import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { BasePostgresModel } from "../base-postgres.entity";

export enum FriendStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

@Entity("user-friends")
export class UserFriend extends BasePostgresModel {
  @ManyToOne(() => User, (destination) => destination.friends)
  @JoinColumn()
  user: User;

  @ManyToOne(() => User)
  @JoinColumn()
  friend: User;

  @Column({
    type: "enum",
    enum: FriendStatus,
    default: FriendStatus.PENDING,
  })
  status: FriendStatus;
}
