import { OAuthProviders, Provider } from '@edotnet/shared-lib';
import { DeepPartial } from 'typeorm';

export const providers: Array<DeepPartial<Provider>> = Object.values(
  OAuthProviders,
).map((p) => ({
  name: p,
}));
