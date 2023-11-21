import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BasePostgresModel } from "../base-postgres.entity";
import { User } from "../users";

export enum NotificationsTypes {
  FRIEND_REQUEST = "FRIEND_REQUEST",
}

@Entity("notifications")
export class Notifications extends BasePostgresModel {
  @Column({
    type: "enum",
    enum: NotificationsTypes,
  })
  type: NotificationsTypes;

  @Column({
    type: "boolean",
    default: false,
  })
  read: boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  deleted: boolean;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  content: object;

  @ManyToOne(() => User, (destination) => destination.notifications)
  @JoinColumn()
  user: User;
}
