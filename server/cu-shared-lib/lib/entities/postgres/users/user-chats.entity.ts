import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BasePostgresModel } from "../base-postgres.entity";
import { Chat } from "./chat.entity";
import { User } from "./user.entity";

@Entity("user-chats")
export class UserChat extends BasePostgresModel {
  @Column()
  inChat: boolean;

  @ManyToOne(() => Chat, (destination) => destination.users)
  @JoinColumn()
  chat: Chat;

  @ManyToOne(() => User, (destination) => destination.chats)
  @JoinColumn()
  user: User;
}
