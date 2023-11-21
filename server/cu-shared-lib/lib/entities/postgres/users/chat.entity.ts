import { BasePostgresModel } from "../base-postgres.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { UserChat } from "./user-chats.entity";

@Entity("chats")
export class Chat extends BasePostgresModel {
  @Column({ nullable: true })
  name: string;

  @Column({ default: false })
  archived: boolean;

  @OneToMany(() => UserChat, (destination) => destination.chat, {
    cascade: true,
  })
  users: UserChat[];
}
