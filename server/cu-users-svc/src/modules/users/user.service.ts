import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository, Not, In } from 'typeorm';
import { RedisService } from '@liaoliaots/nestjs-redis';
import * as bcrypt from 'bcrypt';
import {
  EmptyResponse,
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
  TransactionsService,
  UserProvider,
  UserProfile,
  User,
  UserStatus,
  UserRoles,
  mapUserToUserExtendedResponse,
  UserFriend,
  FriendRequest,
  FriendStatus,
  FriendRequestRespondRequest,
} from '@edotnet/shared-lib';
import { mapUsersToGetUsersResponse } from './user.serializer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserFriend)
    private userFriendsRepository: Repository<UserFriend>,
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
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
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
        statusCode: HttpStatus.FORBIDDEN,
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

  async getFriends(userId: number): Promise<any> {
    const friends = await this.userFriendsRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['friend'],
    });

    const users = await this.userRepository.find({
      where: { id: In(friends.map((f) => f.friend.id)) },
      relations: ['profile'],
    });

    return mapUsersToGetUsersResponse(users);
  }

  async getNonFriends(userId: number): Promise<UserResponse[]> {
    const nonFriends = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoin('user.friends', 'friends')
      .where('user.id != :userId AND user.status = :userStatus', {
        userId,
        userStatus: UserStatus.ACTIVE,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('friend.friendId')
          .from(UserFriend, 'friend')
          .where('friend.userId = :userId', { userId })
          // .andWhere('friends.status != :status', {
          //   status: FriendStatus.ACCEPTED,
          // })
          .getQuery();
        return `user.id NOT IN (${subQuery})`;
      })
      .getMany();

    return mapUsersToGetUsersResponse(nonFriends);
  }

  // NOT IN USE YET, NEED NOTIFICATIONS
  async respondFriendRequest(
    userId: number,
    dto: FriendRequestRespondRequest,
  ): Promise<EmptyResponse> {
    const user = await this.checkUserExistsById(dto.friendId);

    const friendRequst = await this.userFriendsRepository.findOne({
      where: {
        friend: { id: userId },
        user: { id: user.id },
        status: FriendStatus.PENDING,
      },
    });

    if (!friendRequst) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'USER_FRIEND_DOES_NOT_EXIST',
      });
    }

    friendRequst.status = dto.status;

    const newFriend = new UserFriend();

    newFriend.user = new User();
    newFriend.user.id = userId;
    newFriend.friend = user;
    newFriend.status = FriendStatus.ACCEPTED;

    await this.userFriendsRepository.save([friendRequst, newFriend]);

    return {};
  }

  async requestFriend(
    userId: number,
    dto: FriendRequest,
  ): Promise<EmptyResponse> {
    const user = await this.checkUserExistsById(dto.friendId);

    if (dto.friendId === userId) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'CONNOT_BE_FRIENDS_WITH_YOURSELF',
      });
    }

    const friends = await Promise.all([
      this.userFriendsRepository.findOne({
        where: {
          user: { id: userId },
          friend: { id: user.id },
          status: FriendStatus.ACCEPTED,
        },
      }),
      this.userFriendsRepository.findOne({
        where: {
          user: { id: user.id },
          friend: { id: userId },
          status: FriendStatus.ACCEPTED,
        },
      }),
    ]);

    if (!friends.length) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'CONNOT_BE_FRIENDS_WITH_YOURSELF',
      });
    }

    const userRequest = new UserFriend();

    userRequest.user = new User();
    userRequest.user.id = userId;
    userRequest.friend = user;
    userRequest.status = FriendStatus.ACCEPTED;

    const frientRequest = new UserFriend();

    frientRequest.friend = new User();
    frientRequest.friend.id = userId;
    frientRequest.user = user;
    frientRequest.status = FriendStatus.ACCEPTED;

    await this.userFriendsRepository.save([userRequest, frientRequest]);

    return {};
  }

  async unfriend(userId: number, dto: FriendRequest): Promise<EmptyResponse> {
    const user = await this.checkUserExistsById(dto.friendId);

    const friends = await Promise.all([
      this.userFriendsRepository.findOne({
        where: {
          user: { id: userId },
          friend: { id: user.id },
          status: FriendStatus.ACCEPTED,
        },
      }),
      this.userFriendsRepository.findOne({
        where: {
          user: { id: user.id },
          friend: { id: userId },
          status: FriendStatus.ACCEPTED,
        },
      }),
    ]);

    if (!friends.length) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'USER_FRIEND_DOES_NOT_EXIST',
      });
    }

    await this.userFriendsRepository.remove(friends);

    return {};
  }

  private async checkUserExistsByEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
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
        statusCode: HttpStatus.FORBIDDEN,
        message: 'USER_DOES_NOT_EXIST',
      });
    }

    return user;
  }
}
