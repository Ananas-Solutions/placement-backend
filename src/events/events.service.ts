import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Repository } from 'typeorm';

import { QueuesService } from 'src/queues/queues.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Events } from './entity/events.entity';
import { UserService } from 'src/user/user.service';
import { ExecuteEventDto } from './dto/execute-event.dto';
import { SendEmailService } from 'src/utils/sendEmail';

@Injectable()
export class EventsService {
  private messagesQueue;
  constructor(
    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,
    private readonly queueService: QueuesService,
    private readonly userService: UserService,
    private readonly emailService: SendEmailService,
  ) {
    const workerName = this.queueService.getWorkerName('events-queue');
    this.messagesQueue = new Worker(workerName, this.processMessage, {
      connection: new IORedis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      }),
      prefix: 'placement',
    });
  }

  public async createEvent(body: CreateEventDto) {
    const { ...rest } = body;
    await this.eventsRepository.save({
      ...rest,
    });
    const queue = this.queueService.getQueue('events-queue');
    queue.add('events-queue', {
      message: body.message,
      audiences: body.audiences,
    });
  }

  public async getAllEvents(courseId: string) {
    return await this.eventsRepository.find({
      where: { course: { id: courseId } },
    });
  }

  public async findOneEvent(id: string) {
    return await this.eventsRepository.findOne({ where: { id } });
  }

  public async deleteEvent(id: string) {
    return await this.eventsRepository.delete(id);
  }

  public processMessage = async (job: Job<ExecuteEventDto>) => {
    const message = job.data;
    message.audiences.forEach(async (audience) => {
      const user = await this.userService.findUserById(audience);
      const userEmail = user.email;

      const emailData = {
        password: 'password',
        email: userEmail,
        role: 'role',
        name: 'Bibash',
      };

      await this.emailService.sendTemplateEmail({ to: userEmail, emailData });
    });
  };
}
