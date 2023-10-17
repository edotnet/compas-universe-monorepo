import { Column, Entity } from "typeorm";
import { BasePostgresModel } from "./base.entity";

export enum OAuthProviders {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK"
}

@Entity("providers")
export class Provider extends BasePostgresModel {
  @Column({
    type: "enum",
    enum: OAuthProviders,
  })
  name: OAuthProviders;
}
