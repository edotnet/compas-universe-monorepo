import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyFunction } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'FACEBOOK') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>(
        'BASE_URL',
      )}/auth/facebook/callback`,
      profileFields: ['id', 'name', 'emails'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyFunction,
  ): Promise<void> {
    const { id, name, emails, _raw } = profile;

    const user = {
      provider: 'FACEBOOK',
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
