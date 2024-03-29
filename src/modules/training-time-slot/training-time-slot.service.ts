import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { CourseTrainingSiteEntity } from 'entities/course-training-site.entity';
import { TrainingTimeSlotEntity } from 'entities/training-time-slot.entity';
import { UserEntity } from 'entities/user.entity';
import { PlacementService } from 'placement/placement.service';

import {
  BlockTrainingSiteTimeSlotDto,
  TrainingSiteTimeSlotDto,
  UpdateTimeSlotDto,
} from './dto';
import { BlockTrainingTimeSlotEntity } from 'entities/block-training-time-slot.entity';
import { CourseBlockTrainingSiteEntity } from 'entities/block-training-site.entity';

@Injectable()
export class TrainingSiteTimeSlotService {
  constructor(
    @InjectRepository(TrainingTimeSlotEntity)
    private readonly timeslotRepository: Repository<TrainingTimeSlotEntity>,
    @InjectRepository(BlockTrainingTimeSlotEntity)
    private readonly blockTimeslotRepository: Repository<BlockTrainingTimeSlotEntity>,
    private readonly placementService: PlacementService,
  ) {}

  async save(bodyDto: TrainingSiteTimeSlotDto): Promise<any> {
    const { trainingSiteId, ...body } = bodyDto;
    const newTimeSlots = await Promise.all(
      body.timeslots.map(async (timeslot) => {
        let entityData = {};
        entityData = {
          ...entityData,
          startTime: timeslot.startTime,
          endTime: timeslot.endTime,
          day: timeslot.day,
          capacity: timeslot.capacity,
          trainingSite: { id: trainingSiteId } as CourseTrainingSiteEntity,
        };
        if (timeslot.supervisor) {
          entityData = {
            ...entityData,
            supervisor: { id: timeslot.supervisor } as UserEntity,
          };
        }
        return await this.timeslotRepository.save(entityData);
      }),
    );
    return { message: 'Time slots added successfully', newTimeSlots };
  }

  async saveBlockTimeSlots(
    bodyDto: BlockTrainingSiteTimeSlotDto,
  ): Promise<any> {
    const { blockTrainingSiteId, ...body } = bodyDto;
    const newTimeSlots = await Promise.all(
      body.timeslots.map(async (timeslot) => {
        let entityData = {};
        entityData = {
          ...entityData,
          startTime: timeslot.startTime,
          endTime: timeslot.endTime,
          day: timeslot.day,
          capacity: timeslot.capacity,
          blockTrainingSite: {
            id: blockTrainingSiteId,
          } as CourseBlockTrainingSiteEntity,
        };
        if (timeslot.supervisor) {
          entityData = {
            ...entityData,
            supervisor: { id: timeslot.supervisor } as UserEntity,
          };
        }
        return await this.blockTimeslotRepository.save(entityData);
      }),
    );
    return { message: 'Block Time slots added successfully', newTimeSlots };
  }

  async findTimeSlot(timeslotId: string): Promise<any> {
    const timeslot = await this.timeslotRepository.findOne({
      where: {
        id: timeslotId,
      },
      loadEagerRelations: false,
      relations: ['supervisor', 'trainingSite', 'trainingSite.course'],
    });
    return timeslot;
  }

  async findTimeSlots(
    trainingSiteId: string,
  ): Promise<TrainingTimeSlotEntity[]> {
    const trainingSiteTimeSlots = await this.timeslotRepository.find({
      where: { trainingSite: { id: trainingSiteId } },
      loadEagerRelations: false,
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
  }

  async updateTimeSlot(
    timeSlotId: string,
    body: UpdateTimeSlotDto,
  ): Promise<ISuccessMessageResponse> {
    const { trainingSiteId, supervisor, ...rest } = body;
    let entityData = {};
    entityData = {
      ...rest,
      trainingSite: { id: trainingSiteId } as CourseTrainingSiteEntity,
    };
    if (supervisor) {
      entityData = {
        ...entityData,
        supervisor: { id: supervisor } as UserEntity,
      };
    }

    await this.timeslotRepository.update(
      { id: timeSlotId },
      {
        ...entityData,
      },
    );

    return { message: 'Time slot updated successfully.' };
  }

  async deleteTimeSlot(timeslotId: string): Promise<ISuccessMessageResponse> {
    const timeslot = await this.timeslotRepository.findOne({
      where: { id: timeslotId },
    });
    await this.timeslotRepository.softRemove(timeslot);

    return { message: 'Time slot removed successfully.' };
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
