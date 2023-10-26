import {
  OAuthProviders,
  Provider,
} from 'src/modules/schedules/entities/provider.entity';
import { DeepPartial } from 'typeorm';

export const providers: Array<DeepPartial<Provider>> = Object.values(
  OAuthProviders,
).map((p) => ({
  name: p,
}));
