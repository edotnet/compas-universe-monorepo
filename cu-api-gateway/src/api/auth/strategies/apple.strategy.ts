import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'APPLE') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('APPLE_CLIENT_ID'),
      clientSecret: configService.get<string>('APPLE_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>(
        'BASE_URL',
      )}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, name, emails, _raw } = profile;

    const user = {
      provider: 'APPLE',
      providerId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      extra: _raw,
    };

    // @ts-ignore
    done(null, user);
  }
}
