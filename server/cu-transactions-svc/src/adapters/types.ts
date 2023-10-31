export interface IEmailPayload {
  to: string;
  subject: string;
  message?: string;

  adapter: EMAIL_ADAPTERS;
  template?: string;
  templateVariables?: Record<string, string>;
}

export interface IEmailTransportSettings {
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

export enum EMAIL_ADAPTERS {
  mailchimp = 'mailchimp',
}