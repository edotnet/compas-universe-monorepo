import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import {
  EmptyRequest,
  EmptyResponse,
  ForgotPasswordRequest,
  FriendRequest,
  FriendRequestRespondRequest,
  GetFriendsRequest,
  GetNoneFriendsRequest,
  GetUserByEmailRequest,
  InjectAuth,
  OAUTH_UPSERT_USER,
  OauthUserRequest,
  RegisterRequest,
  ResetPasswordRequest,
  USER_FORGOT_PASSWORD,
  USER_FRIENDS_GET,
  USER_GET_BY_EMAIL,
  USER_LOGIN,
  USER_ME_GET,
  USER_NON_FRIENDS_GET,
  USER_PROFILE_GET,
  USER_REGISTER,
  USER_REQUEST_FRIEND,
  USER_RESET_PASSWORD,
  USER_RESPOND_TO_FRIEND_REQUEST,
  USER_UNFRIEND,
  USER_VALIDATE,
  USER_VERIFY_EMAIL,
  User,
  UserExtendedResponse,
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
  async getMe(dto: InjectAuth<EmptyRequest>): Promise<UserExtendedResponse> {
    return this.service.getMe(dto.userId);
  }

  @MessagePattern(USER_REQUEST_FRIEND)
  async requestFriend(dto: InjectAuth<FriendRequest>): Promise<EmptyResponse> {
    return this.service.requestFriend(dto.userId, dto);
  }

  @MessagePattern(USER_RESPOND_TO_FRIEND_REQUEST)
  async respondFriendRequest(
    dto: InjectAuth<FriendRequestRespondRequest>,
  ): Promise<EmptyResponse> {
    return this.service.respondFriendRequest(dto.userId, dto);
  }

  @MessagePattern(USER_UNFRIEND)
  async unfollow(dto: InjectAuth<FriendRequest>): Promise<EmptyResponse> {
    return this.service.unfriend(dto.userId, dto);
  }

  @MessagePattern(USER_NON_FRIENDS_GET)
  async getNonFriends(
    dto: InjectAuth<GetNoneFriendsRequest>,
  ): Promise<UserResponse[]> {
    return this.service.getNonFriends(dto.userId, dto);
  }

  @MessagePattern(USER_FRIENDS_GET)
  async getFriends(
    dto: InjectAuth<GetFriendsRequest>,
  ): Promise<UserResponse[]> {
    return this.service.getFriends(dto.userId, dto);
  }

  @MessagePattern(USER_PROFILE_GET)
  async getUserProfile(dto: InjectAuth<FriendRequest>): Promise<any> {
    return this.service.getUserProfile(dto.userId, dto);
  }
}
