import { Global, Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { UsersServiceClientOptions } from "./options/users-svc.options";
import { DatabaseModule } from "../database";
import { TransactionsServiceClientOptions } from "./options/transactions-svc.options";

export * from "./options/transactions-svc.options";
export * from "./options/transactions-svc.options";

const connections = ClientsModule.register([
  UsersServiceClientOptions,
  TransactionsServiceClientOptions,
]);

@Global()
@Module({
  imports: [connections, DatabaseModule],
  exports: [connections, DatabaseModule],
})
export class ServicesModule {}
