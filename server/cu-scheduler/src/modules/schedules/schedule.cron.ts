import { Inject, Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { v4 as uuidv4 } from 'uuid';
import { AsyncContext } from '@nestjs-steroids/async-context';
import { DEFAULT_SEED_TIMEOUT } from 'src/common/constants/constants';

@Injectable()
export class ScheduleCron {
  constructor(@Inject(ScheduleService) private service: ScheduleService) {}

  genReqId() {
    const asyncHook: AsyncContext = AsyncContext.getInstance();
    const id = uuidv4();
    asyncHook.register();
    asyncHook.set('reqId', id);
  }

  @Timeout(+process.env.DEFAULT_SEED_TIMEOUT || DEFAULT_SEED_TIMEOUT)
  async seedProviders() {
    await this.service.seedProviders();
  }

  @Timeout(+process.env.DEFAULT_SEED_TIMEOUT || DEFAULT_SEED_TIMEOUT)
  async seedUsers() {
    await this.service.seedUsers();
  }
}
