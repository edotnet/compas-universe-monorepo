import { USER_VALIDATE, User } from '@edotnet/shared-lib';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LOCAL_STRATEGY_NAME } from 'src/common/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  LOCAL_STRATEGY_NAME,
) {
  constructor(
    @Inject('users') private readonly usersService: ClientProxy,
    private configService: ConfigService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user: User = await this.usersService
      .send(USER_VALIDATE, { email, password })
      .toPromise();

    return user;
  }
}
