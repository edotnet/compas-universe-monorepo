import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
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
  getUserProfileResponse,
  UserExtendedResponse,
  GetNoneFriendsRequest,
  GetFriendsRequest,
} from '@edotnet/shared-lib';
import { mapFriendsToGetFriendsResponse } from './user.serializer';
import { ChatService } from '../chat/chat.service';
import { FriendsQueryResponse } from './user.types';

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
    private readonly chatService: ChatService,
  ) {}

  async upsertUser(dto: OauthUserRequest): Promise<User> {
    let user: User = await this.userRepository.findOne({
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

    const provider: Provider = await this.providerRepository.findOne({
      where: {
        name: dto.provider,
      },
    });

    const userProvider: UserProvider = new UserProvider();
    userProvider.originalId = dto.providerId;
    userProvider.raw = dto.extra;
    userProvider.provider = provider;

    const profile: UserProfile = new UserProfile();
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

    const user: User = new User();

    user.email = dto.email;
    user.status = UserStatus.ACTIVE;
    user.password = dto.password;
    user.profile = new UserProfile();
    user.profile.userName = dto.userName;

    await this.userRepository.save(user);

    return user;
  }

  async login(userId: number): Promise<User> {
    const user: User = await this.checkUserExistsById(userId);
    user.status = UserStatus.ACTIVE;

    await this.userRepository.save(user);

    return user;
  }

  async validateUser(dto: ValidateUserRequest): Promise<User | null> {
    const user: User = await this.getUserByEmail({ email: dto.email });

    if (user && bcrypt.compareSync(dto.password, user.password)) {
      return user;
    }

    return null;
  }

  async getUserByEmail(dto: GetUserByEmailRequest): Promise<User> {
    dto.email = dto.email.toLowerCase();

    const user: User = await this.userRepository.findOne({
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
    const user: User = await this.getUserByEmail({ email: dto.email });
    const code: string = generateRandomCode();

    const client: Redis = this.redisService.getClient();

    const verificationAttemptsKey: string = `verification_attempts:${user.id}`;
    const currentAttempts: string = await client.get(verificationAttemptsKey);

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
    const user: User = await this.getUserByEmail({ email: dto.email });

    const client: Redis = this.redisService.getClient();
    const code: string = await client.get(`code:${user.email}`);

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
    const user: User = await this.getUserByEmail({ email: dto.email });

    user.password = dto.newPassword;
    await this.userRepository.save(user);

    return {};
  }

  async getMe(userId: number): Promise<UserExtendedResponse> {
    const user: User = await this.checkUserExistsById(userId);

    return mapUserToUserExtendedResponse(user);
  }

  async getFriends(
    userId: number,
    dto: GetFriendsRequest,
  ): Promise<UserResponse[]> {
    let query = `
    SELECT
      "friend"."id" AS "id", 
      "profile"."firstName" AS "firstName", 
      "profile"."lastName" AS "lastName", 
      "profile"."userName" AS "userName", 
      "profile"."profilePicture" AS "profilePicture"
    `;

    const parameters = [userId, dto.skip, dto.take];

    if (dto.friendId) {
      query += `,
        CASE WHEN uf2."userId" IS NOT NULL THEN TRUE ELSE FALSE END AS "isFriend",
        CASE WHEN uf1."friendId" = $1 THEN TRUE ELSE FALSE END AS "me"
      FROM
        "user-friends" uf1
      LEFT JOIN 
        "users" "friend" ON "friend"."id" = "uf1"."friendId" AND "friend"."status" = 'ACTIVE'
      JOIN 
        "user-profiles" "profile" ON "profile"."userId" = "friend"."id"
      LEFT JOIN
        "user-friends" uf2 ON uf1."friendId" = uf2."friendId" AND uf2."userId" = $1
      WHERE 
        uf1."userId" = $4
      `;

      parameters.push(dto.friendId);
    } else {
      query += `
      FROM
        "user-friends" uf1
      JOIN 
        "users" "friend" ON "friend"."id" = "uf1"."friendId" AND "friend"."status" = 'ACTIVE'
      JOIN 
        "user-profiles" "profile" ON "profile"."userId" = "friend"."id"
      WHERE 
        uf1."userId" = $1
      `;
    }

    query += ` 
      LIMIT $3
      OFFSET $2
    `;

    const friends: FriendsQueryResponse[] =
      await this.userFriendsRepository.query(query, parameters);

    return mapFriendsToGetFriendsResponse(friends);
  }

  async getNonFriends(
    userId: number,
    dto: GetNoneFriendsRequest,
  ): Promise<UserResponse[]> {
    const queryBuilder: SelectQueryBuilder<User> = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoin('user.friends', 'friends')
      .where('user.id != :userId AND user.status = :userStatus', {
        userId: dto.friendId ? dto.friendId : userId,
        userStatus: UserStatus.ACTIVE,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('friend.friendId')
          .from(UserFriend, 'friend')
          .where('friend.userId = :userId', {
            userId: dto.friendId ? dto.friendId : userId,
          })
          .getQuery();
        return `user.id NOT IN (${subQuery})`;
      })
      .select([
        'DISTINCT user.id AS id',
        'profile.firstName AS "firstName"',
        'profile.lastName AS "lastName"',
        'profile.userName AS "userName"',
        'profile.profilePicture AS "profilePicture"',
      ]);

    if (dto.friendId) {
      queryBuilder
        .addSelect(
          'CASE WHEN friends.id IS NOT NULL THEN TRUE ELSE FALSE END',
          'isFriend',
        )
        .addSelect(`CASE WHEN user.id = :id THEN TRUE ELSE FALSE END`, 'me')
        .setParameter('id', userId);
    }

    const nonFriends = await queryBuilder
      .skip(dto.skip)
      .take(dto.take)
      .getRawMany();
    return mapFriendsToGetFriendsResponse(nonFriends);
  }

  // NOT IN USE YET, NEED NOTIFICATIONS
  async respondFriendRequest(
    userId: number,
    dto: FriendRequestRespondRequest,
  ): Promise<EmptyResponse> {
    const user: User = await this.checkUserExistsById(dto.friendId);

    const friendRequest: UserFriend = await this.userFriendsRepository.findOne({
      where: {
        friend: { id: userId },
        user: { id: user.id },
        status: FriendStatus.PENDING,
      },
    });

    if (!friendRequest) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'USER_FRIEND_DOES_NOT_EXIST',
      });
    }

    friendRequest.status = dto.status;

    const newFriend: UserFriend = new UserFriend();

    newFriend.user = new User();
    newFriend.user.id = userId;
    newFriend.friend = user;
    newFriend.status = FriendStatus.ACCEPTED;

    await this.userFriendsRepository.save([friendRequest, newFriend]);

    return {};
  }

  async requestFriend(
    userId: number,
    dto: FriendRequest,
  ): Promise<EmptyResponse> {
    const user: User = await this.checkUserExistsById(dto.friendId);

    if (dto.friendId === userId) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'CANNOT_BE_FRIENDS_WITH_YOURSELF',
      });
    }

    const userFriends = await this.getUserFriend(userId, user.id);

    if (userFriends.filter((f) => f !== null).length) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'ALREADY_FRIENDS',
      });
    }

    const userRequest: UserFriend = new UserFriend();

    userRequest.user = new User();
    userRequest.user.id = userId;
    userRequest.friend = user;
    userRequest.status = FriendStatus.ACCEPTED;

    const friendRequest: UserFriend = new UserFriend();

    friendRequest.friend = new User();
    friendRequest.friend.id = userId;
    friendRequest.user = user;
    friendRequest.status = FriendStatus.ACCEPTED;

    await this.userFriendsRepository.save([userRequest, friendRequest]);

    return {};
  }

  async unfriend(userId: number, dto: FriendRequest): Promise<EmptyResponse> {
    const user: User = await this.checkUserExistsById(dto.friendId);

    const userFriends = await this.getUserFriend(userId, user.id);

    if (!userFriends.filter((f) => f !== null).length) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'USER_IS_NOT_FRIEND',
      });
    }

    await this.chatService.removeConversations(userId, userFriends);

    await this.userFriendsRepository.remove(userFriends);

    return {};
  }

  async getUserProfile(
    userId: number,
    dto: FriendRequest,
  ): Promise<getUserProfileResponse> {
    const user: UserExtendedResponse = await this.getMe(dto.friendId);

    const userFriends = await this.getUserFriend(userId, user.id);

    let isFriend: boolean = false;
    if (userFriends.filter((f) => f !== null).length) {
      isFriend = true;
    }

    return {
      user,
      isFriend,
    };
  }

  private async checkUserExistsByEmail(email: string): Promise<void> {
    const user: User = await this.userRepository.findOne({
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
    const user: User = await this.userRepository.findOne({
      where: { id, status: UserStatus.ACTIVE },
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

  private async getUserFriend(
    userId: number,
    friendId: number,
  ): Promise<UserFriend[]> {
    const friends: UserFriend[] = await Promise.all([
      this.userFriendsRepository.findOne({
        where: {
          user: { id: userId },
          friend: { id: friendId },
          status: FriendStatus.ACCEPTED,
        },
        relations: ['friend'],
      }),
      this.userFriendsRepository.findOne({
        where: {
          user: { id: friendId },
          friend: { id: userId },
          status: FriendStatus.ACCEPTED,
        },
        relations: ['friend'],
      }),
    ]);

    return friends;
  }
}
