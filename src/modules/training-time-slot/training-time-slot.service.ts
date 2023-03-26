import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CourseTrainingSiteEntity } from 'entities/course-training-site.entity';
import { TrainingTimeSlotEntity } from 'entities/training-time-slot.entity';
import { UserEntity } from 'entities/user.entity';
import { PlacementService } from 'placement/placement.service';

import { TrainingSiteTimeSlotDto } from './dto';

@Injectable()
export class TrainingSiteTimeSlotService {
  constructor(
    @InjectRepository(TrainingTimeSlotEntity)
    private readonly timeslotRepository: Repository<TrainingTimeSlotEntity>,
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
            trainingSite: { id: trainingSiteId } as CourseTrainingSiteEntity,
            supervisor: { id: timeslot.supervisor } as UserEntity,
          });
        }),
      );
      return { message: 'Time slots added successfully' };
    } catch (err) {
      throw err;
    }
  }

  async findTimeSlots(
    trainingSiteId: string,
  ): Promise<TrainingTimeSlotEntity[]> {
    try {
      const trainingSiteTimeSlots = await this.timeslotRepository.find({
        where: { trainingSite: { id: trainingSiteId } },
        relations: ['supervisor', 'trainingSite', 'trainingSite.course'],
      });

      const allAvailableTimeSlots = await Promise.all(
        trainingSiteTimeSlots.map(async (timeSlot: TrainingTimeSlotEntity) => {
          const { trainingSite } = timeSlot;
          const { course } = trainingSite;
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

  // async findDaysTimeSlots(
  //   courseId: string,
  //   day: TrainingDaysEnum,
  // ): Promise<TrainingTimeSlotEntity[]> {
  //   try {
  //     const trainingSiteAllTimeSlots = await this.timeslotRepository.find({
  //       where: { course: { id: courseId }, day: day },
  //     });
  //     const allAvailableTimeSlots = await Promise.all(
  //       trainingSiteAllTimeSlots.map(
  //         async (timeSlot: TrainingTimeSlotEntity) => {
  //           const assingedStudents =
  //             await this.placementService.findTimeSlotStudents(timeSlot.id);
  //           return {
  //             ...timeSlot,
  //             totalCapacity: timeSlot.capacity,
  //             remainingCapacity: timeSlot.capacity - assingedStudents.length,
  //           };
  //         },
  //       ),
  //     );
  //     return allAvailableTimeSlots;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
}
