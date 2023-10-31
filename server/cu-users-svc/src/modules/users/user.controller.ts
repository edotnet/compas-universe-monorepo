import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import {
  EmptyRequest,
  EmptyResponse,
  FollowRequest,
  ForgotPasswordRequest,
  GetUserByEmailRequest,
  InjectAuth,
  OAUTH_UPSERT_USER,
  OauthUserRequest,
  RegisterRequest,
  ResetPasswordRequest,
  USER_FOLLOW,
  USER_FOLLOWINGS_GET,
  USER_FORGOT_PASSWORD,
  USER_GET_BY_EMAIL,
  USER_LOGIN,
  USER_ME_GET,
  USER_NON_FOLLOWINGS_GET,
  USER_REGISTER,
  USER_RESET_PASSWORD,
  USER_UNFOLLOW,
  USER_VALIDATE,
  USER_VERIFY_EMAIL,
  User,
  UserResponse,
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

  @MessagePattern(USER_LOGIN)
  async login(dto: InjectAuth<EmptyRequest>): Promise<User> {
    return this.service.login(dto.userId);
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

  @MessagePattern(USER_ME_GET)
  async getMe(dto: InjectAuth<EmptyRequest>): Promise<UserResponse> {
    return this.service.getMe(dto.userId);
  }

  @MessagePattern(USER_FOLLOW)
  async follow(dto: InjectAuth<FollowRequest>): Promise<EmptyResponse> {
    return this.service.follow(dto.userId, dto);
  }

  @MessagePattern(USER_UNFOLLOW)
  async unfollow(dto: InjectAuth<FollowRequest>): Promise<EmptyResponse> {
    return this.service.unfollow(dto.userId, dto);
  }

  @MessagePattern(USER_NON_FOLLOWINGS_GET)
  async getNonFollowings(
    dto: InjectAuth<EmptyRequest>,
  ): Promise<UserResponse[]> {
    return this.service.getNonFollowings(dto.userId);
  }

  @MessagePattern(USER_FOLLOWINGS_GET)
  async getFollowings(dto: InjectAuth<EmptyRequest>): Promise<UserResponse[]> {
    return this.service.getFollowings(dto.userId);
  }
}
