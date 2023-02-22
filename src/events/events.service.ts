import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from 'src/courses/entity/courses.entity';
import { Repository } from 'typeorm';
import { CreateEventDto, UpdateEventDto } from './dto/create-event.dto';
import { ExecuteEventDto } from './dto/execute-event.dto';
import { Events } from './entity/events.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,
  ) {}

  public async createEvent(body: CreateEventDto) {
    const { courseId, ...rest } = body;
    return await this.eventsRepository.save({
      ...rest,
      course: { id: courseId } as Courses,
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

  public async updateEvent(body: UpdateEventDto) {
    const { id, courseId, ...rest } = body;
    return await this.eventsRepository.update(id, {
      ...rest,
      course: { id: courseId },
    });
  }

  public async deleteEvent(id: string) {
    return await this.eventsRepository.delete(id);
  }

  public async executeEvent(body: ExecuteEventDto) {
    // grab data;
    // put it in a queue
    // queue will send the message from the template
  }
}
