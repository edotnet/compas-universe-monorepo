import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { TransactionsService } from "./transactions.service";
import { TransactionsServiceName } from "../options/transactions-svc.options";

@Module({
  imports: [
    BullModule.registerQueue({
      name: TransactionsServiceName,
    }),
  ],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
