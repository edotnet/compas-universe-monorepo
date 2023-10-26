import { Md5 } from "ts-md5";
import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Job, JobOptions, Queue } from "bull";
import { TransactionsServiceName } from "@edotnet/shared-lib";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectQueue(TransactionsServiceName) private transactionsQueue: Queue
  ) {}

  async send<T>(
    message: string,
    dto: T,
    options: JobOptions = {}
  ): Promise<Job> {
    const job = await this.transactionsQueue.add(message, dto, {
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
    await this.transactionsQueue.empty();
  }
}
