import {
  User,
  UserRoles,
  UserStatus,
} from 'src/modules/schedules/entities/user.entity';
import { DeepPartial } from 'typeorm';

export const users: Array<DeepPartial<User>> = [
  {
    email: 'yulya.saroyan@bk.ru',
    status: UserStatus.PENDING,
    role: UserRoles.OWNER,
  },
  {
    email: 'ed.baghdasaryan.main@gmail.com',
    status: UserStatus.PENDING,
    role: UserRoles.OWNER,
  },
];
