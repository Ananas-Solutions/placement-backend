import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Repository } from 'typeorm';
import { QueuesService } from 'src/queues/queues.service';
import { CreateCourseEventDto } from './dto/create-event.dto';
import { Events } from './entity/events.entity';
import { UserService } from 'src/user/user.service';
import { ExecuteEventDto } from './dto/execute-event.dto';
import { StudentCourse } from 'src/student-course/entity/student-course.entity';
import { EmailService } from 'src/helpers/send-email.service';

@Injectable()
export class EventsService {
  private messagesQueue;
  constructor(
    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,
    @InjectRepository(StudentCourse)
    private readonly studentCourseRepository: Repository<StudentCourse>,
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
  ): Promise<{ message: string }> {
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
    return { message: 'events added successfully.' };
  }

  public async getAllCourseEvents(courseId: string) {
    return await this.eventsRepository.find({
      where: { courseId },
    });
  }

  public async findOneEvent(id: string) {
    return await this.eventsRepository.findOne({ where: { id } });
  }

  public async deleteEvent(id: string) {
    return await this.eventsRepository.delete(id);
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
}
