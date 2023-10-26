import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TransactionsServiceName, VERIFY_EMAIL, VerifyEmailJob } from '@edotnet/shared-lib';

import { EmailService } from 'src/modules/email/email.service';

@Processor(TransactionsServiceName)
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process(VERIFY_EMAIL)
  async verifyEmail(job: Job<VerifyEmailJob>) {
    await this.emailService.verifyEmail(job.data);
  }
}
