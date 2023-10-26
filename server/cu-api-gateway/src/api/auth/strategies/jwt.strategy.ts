import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { USER_GET_BY_EMAIL, User } from '@edotnet/shared-lib';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('users') private readonly usersService: ClientProxy,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const user: User = await this.usersService
      .send(USER_GET_BY_EMAIL, { email: payload.email })
      .toPromise();

    if (!user) {
      throw new UnauthorizedException();
    }

    req.user = user;

    return user;
  }
}
