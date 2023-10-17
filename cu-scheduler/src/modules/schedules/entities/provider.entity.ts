import { Column, Entity } from "typeorm";
import { BasePostgresModel } from "./base.entity";

export enum OAuthProviders {
  GOOGLE = "GOOGLE",
  FACEBOOk = "FACEBOOK",
}

@Entity("providers")
export class Provider extends BasePostgresModel {
  @Column({
    type: "enum",
    enum: OAuthProviders,
  })
  name: OAuthProviders;
}
