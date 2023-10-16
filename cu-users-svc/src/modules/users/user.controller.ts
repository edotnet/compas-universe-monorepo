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
}
