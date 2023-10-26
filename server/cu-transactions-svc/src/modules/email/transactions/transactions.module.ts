import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsServiceName } from '@edotnet/shared-lib';
import { BullModule } from '@nestjs/bull';

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
