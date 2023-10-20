import { Global, Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { UsersServiceClientOptions } from "./options/users-svc.options";
import { DatabaseModule } from "../database";

export * from "./options/users-svc.options";

const connections = ClientsModule.register([UsersServiceClientOptions]);

@Global()
@Module({
  imports: [connections, DatabaseModule],
  exports: [connections, DatabaseModule],
})
export class ServicesModule {}
