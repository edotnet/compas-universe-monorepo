import { Md5 } from "ts-md5";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectQueue } from "@nestjs/bull";
import { Job, JobOptions, Queue } from "bull";
import { UsersServiceName } from "../options";

@Injectable()
export class UsersService {
  constructor(
    @InjectQueue(UsersServiceName) private UsersQueue: Queue,
    @Inject(UsersServiceName) private readonly client: ClientProxy
  ) {}

  async send<T>(
    message: string,
    dto: T,
    options: JobOptions = {}
  ): Promise<Job> {
    const job = await this.UsersQueue.add(message, dto, {
      attempts: 1,
      backoff: 100,
      removeOnComplete: true,
      removeOnFail: false,
      jobId: Md5.hashStr(message + JSON.stringify(dto)),
      ...options,
    });
    return job;
  }

  async emptyBull() {
    await this.UsersQueue.empty();
  }
}
