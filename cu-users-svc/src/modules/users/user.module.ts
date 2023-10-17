import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Provider } from './entities/provider.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserProvider } from './entities/user-provider.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Provider, UserProfile, UserProvider]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
