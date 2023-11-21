import { Global, Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { DatabaseModule } from "../database";
import { UsersServiceClientOptions } from "./options/users-svc.options";
import { TransactionsServiceClientOptions } from "./options/transactions-svc.options";
import { NotificationsServiceClientOptions } from "./options/notifications-svc.options";

export * from "./options/transactions-svc.options";
export * from "./options/transactions-svc.options";

const connections = ClientsModule.register([
  UsersServiceClientOptions,
  TransactionsServiceClientOptions,
  NotificationsServiceClientOptions
]);

@Global()
@Module({
  imports: [connections, DatabaseModule],
  exports: [connections, DatabaseModule],
})
export class ServicesModule {}
