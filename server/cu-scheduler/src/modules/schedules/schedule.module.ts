import { Logger, Module } from '@nestjs/common';
import { ScheduleModule as NestJsScheduleModule } from '@nestjs/schedule';
import { ScheduleCron } from './schedule.cron';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [NestJsScheduleModule.forRoot()],
  providers: [ScheduleCron, ScheduleService, Logger],
  exports: [ScheduleService],
})
export class ScheduleModule {}
