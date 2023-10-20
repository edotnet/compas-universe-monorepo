import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from './entities/user.entity';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import { UserProvider } from './entities/user-provider.entity';
import { UserProfile } from './entities/user-profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
  ) {}

  async upsertUser(dto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new RpcException({
        message: 'USER_DOES_NOT_EXIST',
        statusCode: HttpStatus.FORBIDDEN,
      });
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

    await this.userRepository.save(user);

    return user;
  }

  async register(dto): Promise<User> {
    await this.checkUserExistsByEmail(dto.email);

    if (dto.password !== dto.confirmPassword) {
      throw new RpcException({
        httpStatus: HttpStatus.FORBIDDEN,
        message: 'PASSWORDS_DO_NOT_MATCH',
      });
    }

    const user = new User();
    user.email = dto.email;
    user.status = UserStatus.PENDING;
    user.password = dto.password;
    user.userName = dto.userName;

    await this.userRepository.save(user);

    return user;
  }

  async validateUser(dto): Promise<User | null> {
    const user = await this.getUserByEmail(dto.email);

    if (user && (await bcrypt.compare(dto.password, user.password))) {
      return user;
    }

    return null;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new RpcException({
        httpStatus: HttpStatus.FORBIDDEN,
        message: 'USER_DOES_NOT_EXIST',
      });
    }

    return user;
  }

  private async checkUserExistsByEmail(email: string) {
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
