import { Column, Entity } from "typeorm";
import { BasePostgresModel } from "../base-postgres.entity";

export enum OAuthProviders {
  GOOGLE = "GOOGLE",
}

@Entity("providers")
export class Provider extends BasePostgresModel {
  @Column({
    type: "enum",
    enum: OAuthProviders,
  })
  name: OAuthProviders;
}
