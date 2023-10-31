import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { IsEmail } from "class-validator";
import { Provider } from "./provider.entity";
import { User } from "./user.entity";
import { BasePostgresModel } from "./base.entity";

@Entity("user-providers")
export class UserProvider extends BasePostgresModel {
  @IsEmail()
  @Column()
  originalId: string;

  @ManyToOne(() => Provider, {})
  @JoinColumn()
  provider: Provider;

  @OneToOne(() => User, (destination) => destination.provider)
  @JoinColumn()
  user: User;

  @Column()
  raw: string;
}
