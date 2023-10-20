import {
  Unique,
  Entity,
  Column,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { BasePostgresModel } from './base.entity';
import { UserProvider } from './user-provider.entity';
import { UserProfile } from './user-profile.entity';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  DEACTIVATED = 'DEACTIVATED',
}

export enum UserRoles {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Entity('users')
export class User extends BasePostgresModel {
  @IsEmail()
  @Column()
  @Unique('email', ['email'])
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
  })
  status: UserStatus;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  userName: string;

  @Column({
    type: 'enum',
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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
  }
}
