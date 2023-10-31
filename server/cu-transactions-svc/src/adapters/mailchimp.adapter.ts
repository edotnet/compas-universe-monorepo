import { entries } from 'lodash';
import * as mailchimp from '@mailchimp/mailchimp_transactional';
import { IEmailPayload, IEmailTransportSettings } from './types';
import { Logger } from '@nestjs/common';

interface EmailResponse {
  _id: string;
  email: string;
  queued_reason: string;
  reject_reason: string;
  status: string;
}

export class MailChimpAdapter {
  private mailchimpInstance;

  constructor(
    private settings: IEmailTransportSettings,
    private logger: Logger,
  ) {
    this.mailchimpInstance = mailchimp(settings.apiKey);
  }

  public async send(emailPayload: IEmailPayload): Promise<boolean> {
    this.logger.log(
      `Sending email to: ${emailPayload.to}, subject: ${
        emailPayload.subject
      }, params: ${JSON.stringify(emailPayload.templateVariables)}`,
    );

    let response: EmailResponse;

    try {
      if (emailPayload.template) {
        response = await this.sendTemplate(emailPayload);
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      return false;
    }

    if (response.status === 'sent') {
      this.logger.log(
        `Email to: ${emailPayload.to}, subject: ${emailPayload.subject} was sent`,
      );

      return true;
    }

    this.logger.log(
      `Email to: ${emailPayload.to}, subject: ${emailPayload.subject} failed`,
    );

    return false;
  }

  private async sendTemplate(emailPayload: IEmailPayload) {
    const variables = this.parseVariables(emailPayload.templateVariables);
    return (
      await this.mailchimpInstance.messages.sendTemplate({
        template_name: emailPayload.template,
        template_content: [],
        async: false,
        message: {
          from_name: this.settings.fromName,
          from_email: this.settings.fromEmail,
          subject: emailPayload.subject,
          to: [{ email: emailPayload.to, type: 'to' }],
          global_merge_vars: variables,
        },
      })
    )[0];
  }

  private parseVariables(variables: Record<string, string>) {
    return entries(variables).map(([name, content]) => ({
      name,
      content,
    }));
  }
}
