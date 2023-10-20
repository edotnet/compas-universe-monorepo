import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(@Inject(UserService) private service: UserService) {}

  @MessagePattern('OAUTH_UPSERT_USER')
  async upsertUser(dto): Promise<User> {
    return this.service.upsertUser(dto);
  }

  @MessagePattern('USER_REGISTER')
  async register(dto): Promise<User> {
    return this.service.register(dto);
  }

  @MessagePattern('USER_VALIDATE')
  async validateUser(dto): Promise<User> {
    return this.service.validateUser(dto);
  }

  @MessagePattern('USER_GET_BY_EMAIL')
  async getUserByEmail(dto): Promise<User> {
    return this.service.getUserByEmail(dto);
  }
}
