import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() {}

  async greet(dto) {
    return dto.message;
  }
}
