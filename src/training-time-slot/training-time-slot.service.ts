import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from 'src/courses/entity/courses.entity';
import { PlacementService } from 'src/placement/placement.service';
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
      const { course, ...body } = bodyDto;
      await Promise.all(
        body.timeslots.map(async (timeslot) => {
          return await this.timeslotRepository.save({
            startTime: timeslot.startTime,
            endTime: timeslot.endTime,
            day: timeslot.day,
            capacity: timeslot.capacity,
            course: { id: course } as Courses,
          });
        }),
      );
      return { message: 'Time slots added successfully' };
    } catch (err) {
      throw err;
    }
  }

  async findTimeSlots(courseId: string): Promise<TrainingTimeSlot[]> {
    try {
      const courseTimeSlots = await this.timeslotRepository.find({
        where: { course: courseId },
      });
      const allAvailableTimeSlots = await Promise.all(
        courseTimeSlots.map(async (timeSlot: TrainingTimeSlot) => {
          const assingedStudents =
            await this.placementService.findTimeSlotStudents(timeSlot.id);

          return {
            ...timeSlot,
            capacity: timeSlot.capacity - assingedStudents.length,
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
