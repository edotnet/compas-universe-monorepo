import { Provider, User } from '@edotnet/shared-lib';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { providers } from 'src/common/constants/seeds/providers.seed';
import { users } from 'src/common/constants/seeds/users.seed';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seedProviders() {
    this.logger.log('Seed Providers');

    providers.forEach(async (p) => {
      const provider = await this.providerRepository.findOne({
        where: { name: p.name },
      });

      if (!provider) {
        await this.providerRepository.save(p);
        this.logger.log(`${p.name} provider added`);
      }
    });

    this.logger.log('Seed Providers done');
  }

  async seedUsers() {
    this.logger.log('Seed Users');

    for (const user of users) {
      const u = await this.userRepository.findOne({
        where: {
          email: user.email,
        },
      });

      if (u) {
        continue;
      }

      this.logger.log(`Create user - ${user.email}`);
      const newUser = new User();
      newUser.email = user.email;
      newUser.role = user.role;
      newUser.status = user.status;

      await this.userRepository.save(newUser);
      this.logger.log(`User created - ${user.email}`);
    }

    this.logger.log('Seed Users done');
  }
}
