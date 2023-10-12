import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(@Inject(UserService) private service: UserService) {}

  @MessagePattern('GREET')
  async greet(dto) {
    return this.service.greet(dto);
  }
}
