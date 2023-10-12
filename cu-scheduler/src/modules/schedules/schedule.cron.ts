import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { v4 as uuidv4 } from 'uuid';
import { AsyncContext } from '@nestjs-steroids/async-context';

@Injectable()
export class ScheduleCron {
  constructor(@Inject(ScheduleService) private service: ScheduleService) {}

  genReqId() {
    const asyncHook: AsyncContext = AsyncContext.getInstance();
    const id = uuidv4();
    asyncHook.register();
    asyncHook.set('reqId', id);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async seed() {
    await this.service.seed();
  }
}
