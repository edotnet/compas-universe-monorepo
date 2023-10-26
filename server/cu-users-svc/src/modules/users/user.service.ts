import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
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
  ValidateUserRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
  generateRandomCode,
} from '@edotnet/shared-lib';
import { TransactionsService } from './transactions';
import { User, UserRoles, UserStatus } from './entities/user.entity';
import { UserProvider } from './entities/user-provider.entity';
import { UserProfile } from './entities/user-profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
    user.userName = dto.userName;

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
}
