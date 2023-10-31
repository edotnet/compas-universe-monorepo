import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import {
  EmptyResponse,
  ForgotPasswordRequest,
  GetUserByEmailRequest,
  OAUTH_UPSERT_USER,
  OauthUserRequest,
  RegisterRequest,
  ResetPasswordRequest,
  USER_FORGOT_PASSWORD,
  USER_GET_BY_EMAIL,
  USER_REGISTER,
  USER_RESET_PASSWORD,
  USER_VALIDATE,
  USER_VERIFY_EMAIL,
  User,
  ValidateUserRequest,
  VerifyEmailRequest,
} from '@edotnet/shared-lib';

@Controller()
export class UserController {
  constructor(@Inject(UserService) private service: UserService) {}

  @MessagePattern(OAUTH_UPSERT_USER)
  async upsertUser(dto: OauthUserRequest): Promise<User> {
    return this.service.upsertUser(dto);
  }

  @MessagePattern(USER_REGISTER)
  async register(dto: RegisterRequest): Promise<User> {
    return this.service.register(dto);
  }

  @MessagePattern(USER_VALIDATE)
  async validateUser(dto: ValidateUserRequest): Promise<User> {
    return this.service.validateUser(dto);
  }

  @MessagePattern(USER_GET_BY_EMAIL)
  async getUserByEmail(dto: GetUserByEmailRequest): Promise<User> {
    return this.service.getUserByEmail(dto);
  }

  @MessagePattern(USER_FORGOT_PASSWORD)
  async forgotPassword(dto: ForgotPasswordRequest): Promise<EmptyResponse> {
    return this.service.forgotPassword(dto);
  }

  @MessagePattern(USER_VERIFY_EMAIL)
  async verifyEmail(dto: VerifyEmailRequest): Promise<EmptyResponse> {
    return this.service.verifyEmail(dto);
  }

  @MessagePattern(USER_RESET_PASSWORD)
  async resetPassword(dto: ResetPasswordRequest): Promise<EmptyResponse> {
    return this.service.resetPassword(dto);
  }
}
