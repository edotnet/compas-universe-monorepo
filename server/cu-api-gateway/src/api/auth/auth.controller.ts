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
import {
  ComposeAuthorizedDto,
  ForgotPasswordRequest,
  OAUTH_UPSERT_USER,
  OAuthProviders,
  OauthUserRequest,
  USER_FORGOT_PASSWORD,
  USER_LOGIN,
  USER_REGISTER,
  USER_RESET_PASSWORD,
  USER_VERIFY_EMAIL,
  User,
  VerifyEmailRequest,
  buildUnauthorizedUrl,
  buildWebUrl,
} from '@edotnet/shared-lib';

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
  @UseGuards(AuthGuard(OAuthProviders.GOOGLE))
  @AllowUnauthorized()
  googleAuth() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard(OAuthProviders.GOOGLE))
  @AllowUnauthorized()
  async googleAuthRedirect(@UserGuard() user: OauthUserRequest, @Res() res) {
    const [userUpsertResult, unauthorizedUrl] = await this.loginUser(user);

    if (unauthorizedUrl) {
      return res.redirect(buildUnauthorizedUrl(unauthorizedUrl));
    }

    const redirectUrl = this.createSignInRedirectUrl(userUpsertResult);

    return res.redirect(redirectUrl);
  }

  @Post('/register')
  @AllowUnauthorized()
  async register(@Body() dto) {
    return this.client.send(USER_REGISTER, dto).toPromise();
  }

  @Post('/login')
  @UseGuards(AuthGuard(LOCAL_STRATEGY_NAME))
  @AllowUnauthorized()
  async login(@UserGuard() user: User, @Res() res) {
    const loggedInUser = await this.client
      .send(USER_LOGIN, ComposeAuthorizedDto(user, {}))
      .toPromise();

    const redirectUrl = this.createSignInRedirectUrl(loggedInUser);

    return res.send(redirectUrl);
  }

  @Post('/forgot-password')
  @AllowUnauthorized()
  async forgotPassword(@Body() dto: ForgotPasswordRequest) {
    return this.client.send(USER_FORGOT_PASSWORD, dto).toPromise();
  }

  @Post('/verify-email')
  @AllowUnauthorized()
  async verifyEmail(@Body() dto: VerifyEmailRequest) {
    return this.client.send(USER_VERIFY_EMAIL, dto).toPromise();
  }

  @Post('/reset-password')
  @AllowUnauthorized()
  async resetPassword(@Body() dto) {
    return this.client.send(USER_RESET_PASSWORD, dto).toPromise();
  }

  private createSignInRedirectUrl(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const appUrl = this.config.get<string>('APP_URL');

    return buildWebUrl(appUrl, '', {
      accessToken,
    });
  }

  private async loginUser(user): Promise<[any, string]> {
    try {
      return [await this.client.send(OAUTH_UPSERT_USER, user).toPromise(), ''];
    } catch (error) {
      const url = this.unauthorizedUrl();

      return [, url];
    }
  }

  private unauthorizedUrl() {
    const appUrl = this.config.get<string>('APP_URL');

    const url = buildWebUrl(appUrl, 'unauthorized');

    return url;
  }
}
