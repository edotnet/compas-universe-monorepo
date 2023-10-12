import { Controller, Inject, Get } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(@Inject('users') private readonly client: ClientProxy) {}

  @Get()
  async greet() {
    return this.client.send('GREET', { message: 'Hello World!' }).toPromise();
  }
}
