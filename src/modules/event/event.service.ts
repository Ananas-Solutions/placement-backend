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

import { CreateCourseEventDto } from './dto/create-course-event.dto';
import { CreateEventDto, ExecuteEventDto } from './dto';
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
    body: CreateEventDto,
  ): Promise<ISuccessMessageResponse> {
    const { name, message, date, ...rest } = body;

    await this.eventsRepository.save({
      name,
      message,
      date,
      audiences: {
        ...rest,
      },
    });

    return { message: 'Event added successfully.' };
  }

  public async createCourseEvent(
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

    return { message: 'Course event added successfully.' };
  }

  public async getAllEvents() {
    const allEvents = await this.eventsRepository.find();

    return allEvents.map((event) => this.transformToResponse(event));
  }

  public async getAllCourseEvents(courseId: string) {
    const allCourseEvents = await this.eventsRepository.find({
      where: { courseId },
    });

    return allCourseEvents.map((event) =>
      this.transformToCourseEventResponse(event),
    );
  }

  public async findOneEvent(id: string) {
    const event = await this.eventsRepository.findOne({ where: { id } });

    return this.transformToCourseEventResponse(event);
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

  private transformToCourseEventResponse(entity: EventEntity): IEventResponse {
    const { id, message, date, name } = entity;

    return {
      id,
      name,
      message,
      date,
    };
  }

  private transformToResponse(entity: EventEntity) {
    const { id, name, message, date } = entity;

    return {
      id,
      name,
      message,
      date,
    };
  }
}
