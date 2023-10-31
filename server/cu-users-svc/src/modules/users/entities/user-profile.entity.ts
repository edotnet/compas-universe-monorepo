import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { BasePostgresModel } from './base.entity';

export enum UserTypes {
  SINGER = 'Singer',
}

@Entity('user-profiles')
export class UserProfile extends BasePostgresModel {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    nullable: true,
  })
  middleName: string;

  @Column({ nullable: true })
  userName: string;

  @Column({
    type: 'enum',
    enum: UserTypes,
    nullable: true,
  })
  type: UserTypes;

  @Column({
    nullable: true,
  })
  profilePicture: string;

  @OneToOne(() => User, (destination) => destination.provider)
  @JoinColumn()
  user: User;
}

export const getFullName = (profile: UserProfile): string =>
  `${profile.firstName} ${profile.lastName}`;
