import { Logger, Module } from '@nestjs/common';
import { ScheduleModule as NestJsScheduleModule } from '@nestjs/schedule';
import { ScheduleCron } from './schedule.cron';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { UserProvider } from './entities/user-provider.entity';
import { User } from './entities/user.entity';
import { Provider } from './entities/provider.entity';
import { UserFollower } from './entities/user-followers';

@Module({
  imports: [
    NestJsScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      UserProfile,
      UserProvider,
      User,
      Provider,
      UserFollower,
    ]),
  ],
  providers: [ScheduleCron, ScheduleService, Logger],
  exports: [ScheduleService],
})
export class ScheduleModule {}
