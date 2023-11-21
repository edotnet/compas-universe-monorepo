import { Logger, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { EmailAdapter } from 'src/adapters/email.adapter';
import { EmailProcessor } from './email.processor';
import { TransactionsModule } from '@edotnet/shared-lib';

@Module({
  imports: [TransactionsModule],
  providers: [
    EmailService,
    EmailAdapter,
    ConfigService,
    Logger,
    EmailProcessor,
  ],
  exports: [EmailService],
})
export class EmailModule {}
