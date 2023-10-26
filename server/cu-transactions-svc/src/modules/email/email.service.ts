import { MESSAGE_TYPES, VerifyEmailJob } from '@edotnet/shared-lib';
import { Injectable } from '@nestjs/common';
import { EmailAdapter } from 'src/adapters/email.adapter';
import { EMAIL_ADAPTERS } from 'src/adapters/types';

@Injectable()
export class EmailService {
  constructor(private emailAdapter: EmailAdapter) {}

  public async verifyEmail(job: VerifyEmailJob): Promise<boolean> {
    return await this.emailAdapter.send({
      template: MESSAGE_TYPES.VERIFY,
      templateVariables: {
        content: job.code,
      },
      to: job.to,
      subject: `Verify`,
      adapter: EMAIL_ADAPTERS.mailchimp,
    });
  }
}
