import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getEmailAdapter } from 'src/common/helpers/get-email-adapter.helper';
import {
  EMAIL_ADAPTERS,
  IEmailPayload,
  IEmailTransportSettings,
} from './types';

@Injectable()
export class EmailAdapter {
  constructor(private configService: ConfigService, private logger: Logger) {}

  public async send(emailPayload: IEmailPayload): Promise<boolean> {
    const adapter = getEmailAdapter(
      EMAIL_ADAPTERS[emailPayload.adapter],
      this.getTransportSettings(emailPayload.adapter),
      this.logger,
    );

    if (!adapter) {
      throw new Error('Invalid adapter');
    }

    return await adapter.send(emailPayload);
  }

  private getTransportSettings(
    adapter: EMAIL_ADAPTERS,
  ): IEmailTransportSettings {
    return {
      apiKey: this.configService.get(`${adapter.toUpperCase()}_API_KEY`),
      fromEmail: this.configService.get(`${adapter.toUpperCase()}_EMAIL`),
      fromName: this.configService.get(`${adapter.toUpperCase()}_NAME`),
    };
  }
}
