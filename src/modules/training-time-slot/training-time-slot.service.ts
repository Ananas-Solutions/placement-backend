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
  UpdateBlockTimeSlotDto,
  UpdateTimeSlotDto,
} from './dto';
import { BlockTrainingTimeSlotEntity } from 'entities/block-training-time-slot.entity';
import { CourseBlockTrainingSiteEntity } from 'entities/block-training-site.entity';
import { CourseGridViewEntity } from 'entities/course-grid-view.entity';

@Injectable()
export class TrainingSiteTimeSlotService {
  constructor(
    @InjectRepository(TrainingTimeSlotEntity)
    private readonly timeslotRepository: Repository<TrainingTimeSlotEntity>,
    @InjectRepository(BlockTrainingTimeSlotEntity)
    private readonly blockTimeslotRepository: Repository<BlockTrainingTimeSlotEntity>,
    @InjectRepository(CourseGridViewEntity)
    private readonly courseGridViewRepository: Repository<CourseGridViewEntity>,
    @InjectRepository(CourseTrainingSiteEntity)
    private readonly courseTrainingSiteRepository: Repository<CourseTrainingSiteEntity>,
    private readonly placementService: PlacementService,
  ) {}

  async save(bodyDto: TrainingSiteTimeSlotDto): Promise<any> {
    const { trainingSiteId, ...body } = bodyDto;

    const trainingSite = await this.courseTrainingSiteRepository.findOne({
      where: {
        id: trainingSiteId,
      },
      relations: { course: true },
    });

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

    await this.courseGridViewRepository.update(
      { course: { id: trainingSite.course.id } },
      { layout: null },
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

        return await this.blockTimeslotRepository.save({ ...entityData });
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

  async findBlockTimeSlot(timeslotId: string): Promise<any> {
    const timeslot = await this.blockTimeslotRepository.findOne({
      where: {
        id: timeslotId,
      },
      loadEagerRelations: false,
      relations: [
        'supervisor',
        'blockTrainingSite',
        'blockTrainingSite.block',
        'blockTrainingSite.block.course',
      ],
    });
    return timeslot;
  }

  async findTimeSlots(
    trainingSiteId: string,
  ): Promise<TrainingTimeSlotEntity[]> {
    try {
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
    } catch (error) {
      console.log('error', error);
    }
  }

  async findBlockTimeSlots(
    blockTrainingSiteId: string,
  ): Promise<BlockTrainingTimeSlotEntity[]> {
    const blockTimeSlots = await this.blockTimeslotRepository.find({
      where: { blockTrainingSite: { id: blockTrainingSiteId } },
      loadEagerRelations: false,
      relations: [
        'supervisor',
        'blockTrainingSite',
        'blockTrainingSite.block.course',
      ],
    });

    const allAvailableTimeSlots = await Promise.all(
      blockTimeSlots.map(async (timeSlot: BlockTrainingTimeSlotEntity) => {
        const { blockTrainingSite } = timeSlot;
        const { course } = blockTrainingSite.block;

        const assingedStudents =
          await this.placementService.findBlockTimeSlotStudents(timeSlot.id);

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

    const trainingSite = await this.courseTrainingSiteRepository.findOne({
      where: { id: trainingSiteId },
      relations: { course: true },
    });

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

    await this.courseGridViewRepository.update(
      { course: { id: trainingSite.course.id } },
      { layout: null },
    );

    return { message: 'Time slot updated successfully.' };
  }

  async updateBlockTimeSlot(
    timeSlotId: string,
    body: UpdateBlockTimeSlotDto,
  ): Promise<ISuccessMessageResponse> {
    const { supervisor, ...rest } = body;
    let entityData = {};
    entityData = {
      ...rest,
    };
    if (supervisor) {
      entityData = {
        ...entityData,
        supervisor: { id: supervisor } as UserEntity,
      };
    }

    await this.blockTimeslotRepository.update(
      { id: timeSlotId },
      {
        ...entityData,
      },
    );

    return { message: 'Time slot updated successfully.' };
  }

  async deleteBlockTimeSlot(
    timeslotId: string,
  ): Promise<ISuccessMessageResponse> {
    const timeslot = await this.blockTimeslotRepository.findOne({
      where: { id: timeslotId },
    });
    await this.blockTimeslotRepository.softRemove(timeslot);

    return { message: 'Time slot removed successfully.' };
  }

  async deleteTimeSlot(timeslotId: string): Promise<ISuccessMessageResponse> {
    const timeslot = await this.timeslotRepository.findOne({
      where: { id: timeslotId },
      relations: { trainingSite: { course: true } },
    });

    await this.timeslotRepository.softRemove(timeslot);

    await this.courseGridViewRepository.update(
      { course: { id: timeslot.trainingSite.course.id } },
      { layout: null },
    );

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
