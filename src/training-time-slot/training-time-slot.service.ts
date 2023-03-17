import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseTrainingSite } from 'src/courses/entity/course-training-site.entity';
import { Courses } from 'src/courses/entity/courses.entity';
import { PlacementService } from 'src/placement/placement.service';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { TrainingSiteTimeSlotDto } from './dto/training-time-slot.dto';
import { TrainingTimeSlot } from './entity/training-time-slot.entity';
import { TrainingDaysEnum } from './types/training-site-days.enum';

@Injectable()
export class TrainingSiteTimeSlotService {
  constructor(
    @InjectRepository(TrainingTimeSlot)
    private readonly timeslotRepository: Repository<TrainingTimeSlot>,
    private readonly placementService: PlacementService,
  ) {}

  async save(bodyDto: TrainingSiteTimeSlotDto): Promise<{ message: string }> {
    try {
      const { trainingSiteId, ...body } = bodyDto;
      await Promise.all(
        body.timeslots.map(async (timeslot) => {
          return await this.timeslotRepository.save({
            startTime: timeslot.startTime,
            endTime: timeslot.endTime,
            day: timeslot.day,
            capacity: timeslot.capacity,
            trainingSite: { id: trainingSiteId } as CourseTrainingSite,
            supervisor: { id: timeslot.supervisor } as User,
          });
        }),
      );
      return { message: 'Time slots added successfully' };
    } catch (err) {
      throw err;
    }
  }

  async findTimeSlots(trainingSiteId: string): Promise<TrainingTimeSlot[]> {
    try {
      const trainingSiteTimeSlots = await this.timeslotRepository.find({
        where: { trainingSite: { id: trainingSiteId } },
        relations: ['supervisor', 'trainingSite', 'trainingSite.course'],
      });
      const { trainingSite } = trainingSiteTimeSlots[0];
      const { course } = trainingSite;
      const allAvailableTimeSlots = await Promise.all(
        trainingSiteTimeSlots.map(async (timeSlot: TrainingTimeSlot) => {
          const assingedStudents =
            await this.placementService.findTimeSlotStudents(timeSlot.id);

          return {
            ...timeSlot,
            totalCapacity: timeSlot.capacity,
            assignedCapacity: assingedStudents.length,
            remainingcapacity: timeSlot.capacity - assingedStudents.length,
            courseId: course.id,
          };
        }),
      );
      return allAvailableTimeSlots;
    } catch (err) {
      throw err;
    }
  }

  async findDaysTimeSlots(
    courseId: string,
    day: TrainingDaysEnum,
  ): Promise<TrainingTimeSlot[]> {
    try {
      const trainingSiteAllTimeSlots = await this.timeslotRepository.find({
        where: { course: courseId, day: day },
      });
      const allAvailableTimeSlots = await Promise.all(
        trainingSiteAllTimeSlots.map(async (timeSlot: TrainingTimeSlot) => {
          const assingedStudents =
            await this.placementService.findTimeSlotStudents(timeSlot.id);
          return {
            ...timeSlot,
            totalCapacity: timeSlot.capacity,
            remainingCapacity: timeSlot.capacity - assingedStudents.length,
          };
        }),
      );
      return allAvailableTimeSlots;
    } catch (err) {
      throw err;
    }
  }
}
