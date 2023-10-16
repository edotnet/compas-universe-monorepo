import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from './entities/user.entity';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import { UserProvider } from './entities/user-provider.entity';
import { UserProfile } from './entities/user-profile.entity';

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
}
