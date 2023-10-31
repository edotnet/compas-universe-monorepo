import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository, Not } from 'typeorm';
import { RedisService } from '@liaoliaots/nestjs-redis';
import * as bcrypt from 'bcrypt';
import {
  EmptyResponse,
  FollowRequest,
  ForgotPasswordRequest,
  GetUserByEmailRequest,
  OauthUserRequest,
  Provider,
  RegisterRequest,
  ResetPasswordRequest,
  UserResponse,
  ValidateUserRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
  generateRandomCode,
  mapUserToUserExtendedResponse,
  mapUserToUserResponse,
} from '@edotnet/shared-lib';
import { TransactionsService } from './transactions';
import { User, UserRoles, UserStatus } from './entities/user.entity';
import { UserProvider } from './entities/user-provider.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserFollower } from './entities/user-followers';
import { mapUsersToGetUsersResponse } from './user.serializer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserFollower)
    private userFollowersRepository: Repository<UserFollower>,
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
    private readonly transactionsService: TransactionsService,
    private readonly redisService: RedisService,
  ) {}

  async upsertUser(dto: OauthUserRequest): Promise<User> {
    let user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      const newUser = new User();
      newUser.email = dto.email;
      newUser.status = UserStatus.PENDING;
      newUser.role = UserRoles.MEMBER;

      user = await this.userRepository.save(newUser);
    }

    if (
      user.status === UserStatus.DEACTIVATED ||
      user.status === UserStatus.CANCELLED
    ) {
      throw new RpcException({
        message: 'USER_DEACTIVATED_OR_CANCELLED',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    if (user.status === UserStatus.ACTIVE) {
      return user;
    }

    const provider = await this.providerRepository.findOne({
      where: {
        name: dto.provider,
      },
    });

    const userProvider = new UserProvider();
    userProvider.originalId = dto.providerId;
    userProvider.raw = dto.extra;
    userProvider.provider = provider;

    const profile = new UserProfile();
    profile.firstName = dto.firstName;
    profile.lastName = dto.lastName;

    user.profile = profile;
    user.provider = userProvider;
    user.status = UserStatus.ACTIVE;

    await this.userRepository.save(user);

    return user;
  }

  async register(dto: RegisterRequest): Promise<User> {
    await this.checkUserExistsByEmail(dto.email);

    const user = new User();
    user.email = dto.email;
    user.status = UserStatus.PENDING;
    user.password = dto.password;
    user.profile = new UserProfile();
    user.profile.userName = dto.userName;

    await this.userRepository.save(user);

    return user;
  }

  async login(userId: number): Promise<User> {
    const user = await this.checkUserExistsById(userId);
    user.status = UserStatus.ACTIVE;

    await this.userRepository.save(user);

    return user;
  }

  async validateUser(dto: ValidateUserRequest): Promise<User | null> {
    const user = await this.getUserByEmail({ email: dto.email });

    if (user && (await bcrypt.compare(dto.password, user.password))) {
      return user;
    }

    return null;
  }

  async getUserByEmail(dto: GetUserByEmailRequest): Promise<User> {
    dto.email = dto.email.toLowerCase();
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new RpcException({
        httpStatus: HttpStatus.FORBIDDEN,
        message: 'USER_DOES_NOT_EXIST',
      });
    }

    return user;
  }

  async forgotPassword(dto: ForgotPasswordRequest): Promise<EmptyResponse> {
    const user = await this.getUserByEmail({ email: dto.email });
    const code = generateRandomCode();

    const client = this.redisService.getClient();

    const verificationAttemptsKey = `verification_attempts:${user.id}`;
    const currentAttempts = await client.get(verificationAttemptsKey);

    if (currentAttempts && parseInt(currentAttempts) >= 2) {
      throw new RpcException({
        httpStatus: HttpStatus.TOO_MANY_REQUESTS,
        message: 'LIMIT_REACHED_TRY_LATER',
      });
    }

    await client.set(`code:${user.email}`, code);
    await client.expire(
      `code:${user.email}`,
      currentAttempts && parseInt(currentAttempts) > 0 ? 3600 : 60,
    );

    if (!currentAttempts) {
      await client.setex(verificationAttemptsKey, 60 * 60 * 24, 1);
    } else {
      await client.incr(verificationAttemptsKey);
    }

    await this.transactionsService.send('VERIFY_EMAIL', {
      to: user.email,
      code,
    });

    return {};
  }

  async verifyEmail(dto: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const user = await this.getUserByEmail({ email: dto.email });

    const client = this.redisService.getClient();
    const code = await client.get(`code:${user.email}`);

    if (code !== dto.code) {
      throw new RpcException({
        httpStatus: HttpStatus.FORBIDDEN,
        message: 'INVALID_CODE',
      });
    }

    await client.del(`code:${dto.email}`);
    await client.del(`verification_attempts:${user.id}`);

    return {
      verify: true,
    };
  }

  async resetPassword(dto: ResetPasswordRequest): Promise<EmptyResponse> {
    const user = await this.getUserByEmail({ email: dto.email });

    user.password = dto.newPassword;
    await this.userRepository.save(user);

    return {};
  }

  async getMe(userId: number): Promise<UserResponse> {
    const user = await this.checkUserExistsById(userId);

    return mapUserToUserExtendedResponse(user);
  }

  async getFollowings(userId: number): Promise<any> {
    const followings = await this.userRepository.find({
      where: {
        followers: { follower: { id: userId, status: UserStatus.ACTIVE } },
      },
      relations: ['profile'],
    });

    return mapUsersToGetUsersResponse(followings);
  }

  async getNonFollowings(userId: number): Promise<UserResponse[]> {
    const nonFollowings = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.followers', 'followers')
      .where('user.id != :userId', { userId })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('follower.followingId')
          .from(UserFollower, 'follower')
          .where('follower.followerId = :userId', { userId })
          .getQuery();
        return `user.id NOT IN (${subQuery})`;
      })
      .getMany();

    return mapUsersToGetUsersResponse(nonFollowings);
  }

  async follow(userId: number, dto: FollowRequest): Promise<EmptyResponse> {
    const user = await this.checkUserExistsById(dto.followingId);

    if (dto.followingId === userId) {
      throw new RpcException({
        httpStatus: HttpStatus.FORBIDDEN,
        message: 'CONNOT_FOLLOW_YOURSELF',
      });
    }

    const newFollow = new UserFollower();

    newFollow.follower = new User();
    newFollow.follower.id = userId;
    newFollow.following = user;

    await this.userFollowersRepository.save(newFollow);

    return {};
  }

  async unfollow(userId: number, dto: FollowRequest): Promise<EmptyResponse> {
    const user = await this.checkUserExistsById(dto.followingId);

    const follow = await this.userFollowersRepository.findOne({
      where: { follower: { id: userId }, following: { id: user.id } },
    });

    if (!follow) {
      throw new RpcException({
        httpStatus: HttpStatus.FORBIDDEN,
        message: 'USER_FOLLOW_DOES_NOT_EXIST',
      });
    }

    await this.userFollowersRepository.remove(follow);

    return {};
  }

  private async checkUserExistsByEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new RpcException({
        httpStatus: HttpStatus.FORBIDDEN,
        message: 'USER_ALREADY_EXISTS',
      });
    }
  }

  private async checkUserExistsById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new RpcException({
        httpStatus: HttpStatus.FORBIDDEN,
        message: 'USER_DOES_NOT_EXIST',
      });
    }

    return user;
  }
}
