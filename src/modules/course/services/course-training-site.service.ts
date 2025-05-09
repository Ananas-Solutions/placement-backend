import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { CourseBlockTrainingSiteDto, CourseTrainingSiteDto } from 'course/dto';
import {
  CourseTrainingSiteResponse,
  IAddTrainingSiteResponse,
} from 'course/response';
import {
  CourseEntity,
  CourseTrainingSiteEntity,
  DepartmentUnitEntity,
  TrainingSiteEvaluationEntity,
} from 'entities/index.entity';
import { CourseBlockTrainingSiteEntity } from 'entities/block-training-site.entity';
import { CourseBlockEntity } from 'entities/course-block.entity';
import { CourseGridViewEntity } from 'entities/course-grid-view.entity';

@Injectable()
export class CourseTrainingSiteService {
  constructor(
    @InjectRepository(CourseTrainingSiteEntity)
    private readonly trainingSiteRepository: Repository<CourseTrainingSiteEntity>,
    @InjectRepository(CourseBlockTrainingSiteEntity)
    private readonly blockTrainingSiteRepository: Repository<CourseBlockTrainingSiteEntity>,
    @InjectRepository(TrainingSiteEvaluationEntity)
    private readonly trainingSiteEvaluationRepository: Repository<TrainingSiteEvaluationEntity>,
    @InjectRepository(CourseGridViewEntity)
    private readonly courseGridViewRepository: Repository<CourseGridViewEntity>,
  ) {}

  async addTrainingSite(
    body: CourseTrainingSiteDto,
  ): Promise<IAddTrainingSiteResponse> {
    const { courseId, departmentUnitId } = body;
    const existingTrainingSite = await this.findExistingTrainingSite(
      courseId,
      departmentUnitId,
    );
    if (existingTrainingSite) {
      throw new ConflictException(
        'The following training site already exists in this course.',
      );
    }

    const newTrainingSite = await this.trainingSiteRepository.save({
      course: { id: courseId } as CourseEntity,
      departmentUnit: { id: departmentUnitId } as DepartmentUnitEntity,
    });

    await this.courseGridViewRepository.update(
      { course: { id: courseId } },
      { layout: null },
    );

    return {
      trainingSiteId: newTrainingSite.id,
      message: 'Training site added successfully.',
    };
  }

  async addBlockTrainingSite(
    body: CourseBlockTrainingSiteDto,
  ): Promise<IAddTrainingSiteResponse> {
    const { departmentUnitId, blockId } = body;

    const existingBlockTrainingSite = await this.findExistingBlockTrainingSite(
      departmentUnitId,
      blockId,
    );

    if (existingBlockTrainingSite) {
      throw new ConflictException(
        'The following block training site already exists.',
      );
    }

    const newTrainingSite = await this.blockTrainingSiteRepository.save({
      block: { id: blockId } as CourseBlockEntity,
      departmentUnit: { id: departmentUnitId } as DepartmentUnitEntity,
    });

    return {
      trainingSiteId: newTrainingSite.id,
      message: 'Block Training site added successfully.',
    };
  }

  async createTrainingSite(
    body: CourseTrainingSiteDto,
    skipUpdateGridView = false,
  ): Promise<IAddTrainingSiteResponse> {
    const { courseId, departmentUnitId } = body;
    const existingTrainingSite = await this.findExistingTrainingSite(
      courseId,
      departmentUnitId,
    );
    if (existingTrainingSite) {
      return {
        trainingSiteId: existingTrainingSite.id,
        message: 'Training site found successfully',
      };
    }

    const newTrainingSite = await this.trainingSiteRepository.save({
      course: { id: courseId } as CourseEntity,
      departmentUnit: { id: departmentUnitId } as DepartmentUnitEntity,
    });

    if (!skipUpdateGridView) {
      await this.courseGridViewRepository.update(
        { course: { id: courseId } },
        { layout: null },
      );
    }

    return {
      trainingSiteId: newTrainingSite.id,
      message: 'Training site added successfully.',
    };
  }

  async createBlockTrainingSite(
    body: CourseBlockTrainingSiteDto,
  ): Promise<IAddTrainingSiteResponse> {
    const { departmentUnitId, blockId } = body;

    const existingBlockTrainingSite = await this.findExistingBlockTrainingSite(
      departmentUnitId,
      blockId,
    );

    if (existingBlockTrainingSite) {
      return {
        trainingSiteId: existingBlockTrainingSite.id,
        message: 'Block Training site found successfully',
      };
    }

    const newTrainingSite = await this.blockTrainingSiteRepository.save({
      block: { id: blockId } as CourseBlockEntity,
      departmentUnit: { id: departmentUnitId } as DepartmentUnitEntity,
    });

    return {
      trainingSiteId: newTrainingSite.id,
      message: 'Block Training site added successfully.',
    };
  }

  async findExistingTrainingSite(courseId: string, departmentUnitId: string) {
    return await this.trainingSiteRepository.findOne({
      where: {
        course: { id: courseId },
        departmentUnit: { id: departmentUnitId },
      },
      loadEagerRelations: false,
    });
  }

  async findExistingBlockTrainingSite(
    departmentUnitId: string,
    blockId: string,
  ) {
    return await this.blockTrainingSiteRepository.findOne({
      where: {
        departmentUnit: { id: departmentUnitId },
        block: { id: blockId },
      },
      loadEagerRelations: false,
    });
  }

  async getAllTrainingSite(
    courseId: string,
  ): Promise<CourseTrainingSiteResponse[]> {
    const allTrainingSites = await this.trainingSiteRepository.find({
      where: { course: { id: courseId } },
      loadEagerRelations: false,
      relations: [
        'departmentUnit',
        'departmentUnit.department',
        'departmentUnit.department.hospital',
        'timeslots',
        'placement',
      ],
    });

    const mappedResult = await Promise.all(
      allTrainingSites.map(async (trainingSite) => {
        const allTrainingSiteEvaluation =
          await this.trainingSiteEvaluationRepository.find({
            where: { trainingSite: { id: trainingSite.id } },
          });

        if (!trainingSite) {
          return null;
        }

        const { departmentUnit } = trainingSite;

        if (!departmentUnit) {
          return null;
        }

        const { department } = departmentUnit;

        if (!department) {
          return null;
        }

        const { hospital } = department;

        if (!hospital) {
          return null;
        }

        const { timeslots } = trainingSite;

        const { placement } = trainingSite;

        const totalTimeslotsCapacity = timeslots.reduce((acc, curr) => {
          return acc + curr.capacity;
        }, 0);

        return {
          id: trainingSite.id,
          hospital: hospital.name,
          department: department.name,
          departmentUnit: departmentUnit.name,
          totalEvaluations: allTrainingSiteEvaluation.length,
          totalCapacity: totalTimeslotsCapacity,
          availableCapacity: totalTimeslotsCapacity - placement.length,
          timeslots,
        };
      }),
    );

    return mappedResult.filter(Boolean);
  }

  async getAllBlockTrainingSite(
    blockId: string,
  ): Promise<CourseTrainingSiteResponse[]> {
    const allTrainingSites = await this.blockTrainingSiteRepository.find({
      where: { block: { id: blockId } },
      loadEagerRelations: false,
      relations: [
        'departmentUnit',
        'departmentUnit.department',
        'departmentUnit.department.hospital',
        'blockTimeslots',
        'placement',
      ],
    });

    const mappedResult = await Promise.all(
      allTrainingSites.map(async (trainingSite) => {
        const { departmentUnit } = trainingSite;
        const { department } = departmentUnit;
        const { hospital } = department;

        const { blockTimeslots } = trainingSite;

        const { placement } = trainingSite;

        const totalTimeslotsCapacity = blockTimeslots.reduce((acc, curr) => {
          return acc + curr.capacity;
        }, 0);

        return {
          id: trainingSite.id,
          hospital: hospital.name,
          department: department.name,
          departmentUnit: departmentUnit.name,
          totalCapacity: totalTimeslotsCapacity,
          availableCapacity: totalTimeslotsCapacity - placement.length,
        };
      }),
    );

    return mappedResult;
  }

  public async updateTrainingSite(
    trainingSiteId: string,
    body: CourseTrainingSiteDto,
  ) {
    const { courseId, departmentUnitId } = body;
    const existingTrainingSite = await this.findExistingTrainingSite(
      courseId,
      departmentUnitId,
    );
    if (existingTrainingSite) {
      throw new ConflictException(
        'The following department is already marked as the training site for the course.',
      );
    }

    await this.trainingSiteRepository.update(
      { id: trainingSiteId },
      {
        course: { id: courseId } as CourseEntity,
        departmentUnit: { id: departmentUnitId } as DepartmentUnitEntity,
      },
    );

    await this.courseGridViewRepository.update(
      { course: { id: courseId } },
      { layout: null },
    );

    return { message: 'Training site updated successfully.' };
  }

  public async updateBlockTrainingSite(
    trainingSiteId: string,
    body: CourseBlockTrainingSiteDto,
  ) {
    const { departmentUnitId, blockId } = body;
    const existingTrainingSite = await this.findExistingBlockTrainingSite(
      departmentUnitId,
      blockId,
    );
    if (existingTrainingSite) {
      throw new ConflictException(
        'The following department is already marked as the training site for the block.',
      );
    }

    await this.blockTrainingSiteRepository.update(
      { id: trainingSiteId },
      {
        block: { id: blockId } as CourseBlockEntity,
        departmentUnit: { id: departmentUnitId } as DepartmentUnitEntity,
      },
    );

    await this.trainingSiteRepository.findOne({
      where: { id: trainingSiteId },
      loadEagerRelations: false,
    });

    return { message: 'Training site updated successfully.' };
  }

  public async deleteTrainingSite(
    trainingSiteId: string,
  ): Promise<ISuccessMessageResponse> {
    const trainingSite = await this.trainingSiteRepository.findOne({
      where: { id: trainingSiteId },
      relations: { course: true },
    });

    if (trainingSite) {
      await this.trainingSiteRepository.softRemove(trainingSite);

      await this.courseGridViewRepository.update(
        { course: { id: trainingSite.course.id } },
        { layout: null },
      );

      return { message: 'Training site removed successfully.' };
    }

    const blockTrainingSite = await this.blockTrainingSiteRepository.findOne({
      where: { id: trainingSiteId },
      relations: { block: true },
    });

    if (blockTrainingSite) {
      await this.deleteBlockTrainingSite(trainingSiteId);
    }
  }

  public async deleteBlockTrainingSite(
    trainingSiteId: string,
  ): Promise<ISuccessMessageResponse> {
    const trainingSite = await this.blockTrainingSiteRepository.findOne({
      where: { id: trainingSiteId },
      relations: { block: true },
    });
    await this.blockTrainingSiteRepository.softRemove(trainingSite);

    return { message: 'Training site removed successfully.' };
  }

  public async getExportTrainingSites(courseId: string) {
    const trainingSites = await this.trainingSiteRepository.find({
      where: {
        course: { id: courseId },
      },
      loadEagerRelations: false,
      relations: [
        'departmentUnit',
        'departmentUnit.department',
        'departmentUnit.department.hospital',
        'timeslots',
        'timeslots.placements',
      ],
    });
    const mappedTrainingSites = trainingSites.map((site) => {
      const { timeslots, departmentUnit } = site;
      if (timeslots.length === 0) {
        return undefined;
      }
      const mappedTimeSlots = timeslots.map((slot) => {
        const { placements } = slot;
        if (placements.length === 0) {
          return undefined;
        }
        return {
          trainingSiteId: site.id,
          departmentUnit: departmentUnit.name,
          hospital: departmentUnit.department.hospital.name,
          department: departmentUnit.department.name,
        };
      });
      return mappedTimeSlots;
    });
    const filteredTrainingSites = mappedTrainingSites.flat(10).filter(Boolean);

    const uniqueTrainingSites = [
      ...new Map(
        filteredTrainingSites.map((item) => [item['trainingSiteId'], item]),
      ).values(),
    ];

    return uniqueTrainingSites;
  }

  public async getTrainingSite(trainingSiteId: string) {
    const trainingSite = await this.trainingSiteRepository.findOne({
      where: { id: trainingSiteId },
      loadEagerRelations: false,
      relations: [
        'departmentUnit',
        'departmentUnit.department',
        'departmentUnit.department.hospital',
        'timeslots',
      ],
    });
    return trainingSite;
  }

  public async getBlockTrainingSite(blockTrainingSiteId: string) {
    const blockTrainingSite = await this.blockTrainingSiteRepository.findOne({
      where: { id: blockTrainingSiteId },
      loadEagerRelations: false,
      relations: [
        'departmentUnit',
        'departmentUnit.department',
        'departmentUnit.department.hospital',
        'block',
        'blockTimeslots',
      ],
    });
    return blockTrainingSite;
  }

  public async getTrainingSiteSupervisor(trainingSiteId: string) {
    const trainingSite = await this.trainingSiteRepository.findOne({
      where: { id: trainingSiteId },
      loadEagerRelations: false,
      relations: [
        'departmentUnit',
        'departmentUnit.departmentSupervisor',
        'departmentUnit.departmentSupervisor.supervisor',
      ],
    });
    const mappedSupervisor = (
      trainingSite.departmentUnit.departmentSupervisor as any
    ).map(({ supervisor }) => supervisor);

    return mappedSupervisor;
  }
}
