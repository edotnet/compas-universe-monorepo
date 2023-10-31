import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { BasePostgresModel } from "../base-postgres.entity";

@Entity("user-profiles")
export class UserProfile extends BasePostgresModel {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    nullable: true,
  })
  middleName: string;

  @OneToOne(() => User, (destination) => destination.provider)
  @JoinColumn()
  user: User;
}
