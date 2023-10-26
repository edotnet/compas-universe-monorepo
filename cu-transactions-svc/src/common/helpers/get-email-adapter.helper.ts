import { Logger } from "@nestjs/common";
import { MailChimpAdapter } from "src/adapters/mailchimp.adapter";
import { EMAIL_ADAPTERS, IEmailTransportSettings } from "src/adapters/types";


export const getEmailAdapter = (
  type: EMAIL_ADAPTERS,
  settings: IEmailTransportSettings,
  logger: Logger
) => {
  switch (type) {
    case EMAIL_ADAPTERS.mailchimp:
      return new MailChimpAdapter(settings, logger);
  }
};
