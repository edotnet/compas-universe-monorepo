import {
  Unique,
  Entity,
  Column,
  OneToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { IsEmail } from "class-validator";
import { UserProvider } from "./user-provider.entity";
import { UserProfile } from "./user-profile.entity";
import * as bcrypt from "bcrypt";
import { BasePostgresModel } from "../base-postgres.entity";
import { UserFriend } from "./user-friends.entity";
import { UserChat } from "./user-chats.entity";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  DEACTIVATED = "DEACTIVATED",
}

export enum UserRoles {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

@Entity("users")
export class User extends BasePostgresModel {
  @IsEmail()
  @Column()
  @Unique("email", ["email"])
  email: string;

  @Column({
    type: "enum",
    enum: UserStatus,
  })
  status: UserStatus;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: "enum",
    enum: UserRoles,
    default: UserRoles.MEMBER,
  })
  role: UserRoles;

  @OneToOne(() => UserProvider, (destination) => destination.user, {
    cascade: true,
  })
  provider: UserProvider;

  @OneToOne(() => UserProfile, (destination) => destination.user, {
    cascade: true,
  })
  profile: UserProfile;

  @OneToMany(() => UserFriend, (destination) => destination.user, {
    cascade: true,
  })
  friends: UserFriend[];

  @OneToMany(() => UserChat, (destination) => destination.user, {
    cascade: true,
  })
  chats: UserChat[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async prepareEmail() {
    this.email = this.email.toLowerCase();
  }
}
