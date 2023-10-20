import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  UseGuards,
  Res,
  Inject,
  Post,
  Body,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AllowUnauthorized } from './guards/allow-unauthorized.guard';
import { UserGuard } from './guards/user.guard';
import { LOCAL_STRATEGY_NAME } from 'src/common/constants';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('users') private readonly client: ClientProxy,
  ) {}

  @Get('/google')
  @UseGuards(AuthGuard('GOOGLE'))
  @AllowUnauthorized()
  googleAuth() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('GOOGLE'))
  @AllowUnauthorized()
  async googleAuthRedirect(@UserGuard() user, @Res() res) {
    const [userUpsertResult, unauthorizedUrl] = await this.loginUser(user);

    if (unauthorizedUrl) {
      return res.redirect(this.buildUnauthorizedUrl(unauthorizedUrl));
    }

    const redirectUrl = this.createSignInRedirectUrl(userUpsertResult);

    return res.redirect(redirectUrl);
  }

  @Post('/register')
  @AllowUnauthorized()
  async register(@Body() dto) {
    return this.client.send('USER_REGISTER', dto).toPromise();
  }

  @Post('/login')
  @UseGuards(AuthGuard(LOCAL_STRATEGY_NAME))
  @AllowUnauthorized()
  async login(@UserGuard() user, @Res() res) {
    const unauthorizedUrl = this.unauthorizedUrl();

    if (!user) {
      return res.redirect(this.buildUnauthorizedUrl(unauthorizedUrl));
    }

    const redirectUrl = this.createSignInRedirectUrl(user);

    return res.redirect(redirectUrl);
  }

  private createSignInRedirectUrl(user): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const appUrl = this.config.get<string>('APP_URL');

    return this.buildWebUrl(appUrl, '', {
      accessToken,
    });
  }

  private async loginUser(user): Promise<[any, string]> {
    try {
      return [
        await this.client.send('OAUTH_UPSERT_USER', user).toPromise(),
        '',
      ];
    } catch (error) {
      const url = this.unauthorizedUrl();

      return [, url];
    }
  }

  private unauthorizedUrl() {
    const appUrl = this.config.get<string>('APP_URL');

    const url = this.buildWebUrl(appUrl, 'unauthorized');

    return url;
  }

  private buildWebUrl(
    baseUrl: string,
    path: string,
    queryParams?: Record<string, string>,
  ): string {
    let url = [baseUrl, path].join('/');

    if (queryParams) {
      url = [url, new URLSearchParams(queryParams).toString()].join('?');
    }

    return url;
  }

  private buildUnauthorizedUrl(path: string): string {
    return path.replace('%SUBDOMAIN%.', '');
  }
}
