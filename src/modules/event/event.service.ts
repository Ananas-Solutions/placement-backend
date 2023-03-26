import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Repository } from 'typeorm';

import { QueuesService } from 'src/queues/queues.service';
import { UserService } from 'user/user.service';
import { EmailService } from 'helper/send-email.service';
import { EventEntity } from 'entities/events.entity';
import { StudentCourseEntity } from 'entities/student-course.entity';

import { CreateCourseEventDto } from './dto/create-event.dto';
import { ExecuteEventDto } from './dto';
import { ISuccessMessageResponse } from 'commons/response';
import { IEventResponse } from './response/event.response';

@Injectable()
export class EventService {
  private messagesQueue;
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
    private readonly queueService: QueuesService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
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

  public async createEvent(
    body: CreateCourseEventDto,
  ): Promise<ISuccessMessageResponse> {
    const { ...rest } = body;
    await this.eventsRepository.save({
      ...rest,
    });
    const courseStudent = await this.studentCourseRepository.find({
      where: { course: { id: body.courseId } },
      relations: ['student'],
    });
    const audiences = courseStudent.map((cs) => cs.student.id);
    const queue = this.queueService.getQueue('events-queue');
    await queue.add('events-queue', {
      message: body.message,
      date: body.date,
      audiences: audiences,
    });

    return { message: 'Events added successfully.' };
  }

  public async getAllCourseEvents(courseId: string) {
    const allEvents = await this.eventsRepository.find({
      where: { courseId },
    });
    allEvents.map((event) => this.transformToResponse(event));
  }

  public async findOneEvent(id: string) {
    const event = await this.eventsRepository.findOne({ where: { id } });

    return this.transformToResponse(event);
  }

  public async deleteEvent(id: string): Promise<ISuccessMessageResponse> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    await this.eventsRepository.softRemove(event);

    return { message: 'Event deleted successfully.' };
  }

  public processMessage = async (job: Job<ExecuteEventDto>) => {
    const jobData = job.data;
    jobData.audiences.forEach(async (audience) => {
      const user = await this.userService.findUserById(audience);
      const userEmail = user.email;

      const emailData = {
        username: user.name,
        eventMessage: jobData.message,
        eventDate: jobData.date,
      };

      await this.emailService.sendEventEmails(userEmail, emailData);
    });
  };

  private transformToResponse(entity: EventEntity): IEventResponse {
    const { id, message, date } = entity;

    return {
      id,
      message,
      date,
    };
  }
}
