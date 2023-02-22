import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class QueuesService {
  private queues = {};

  private defaultJobOptions;

  constructor() {
    this.defaultJobOptions = {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3 },
      removeOnComplete: 1000,
      removeOnFail: false,
    };
  }

  getWorkerName = (name: string): string => {
    return name;
  };

  getQueue(name: string): Queue {
    const queueName = name;
    if (queueName in this.queues) {
      return this.queues[queueName].queue;
    }
    this.queues[queueName] = {
      queue: new Queue(queueName, {
        connection: new IORedis({
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT, 10),
        }),
        defaultJobOptions: this.defaultJobOptions,
        prefix: 'placement',
      }),
    };

    return this.queues[queueName].queue;
  }
}
