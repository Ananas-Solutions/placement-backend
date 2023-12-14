import { ConflictException, Injectable } from '@nestjs/common';

import { ISuccessMessageResponse } from 'commons/response';
import { CourseTrainingSiteDto } from 'course/dto';
import {
  CourseTrainingSiteResponse,
  IAddTrainingSiteResponse,
} from 'course/response';
import { CourseEntity, DepartmentUnitEntity } from 'entities/index.entity';
import {
  CourseTrainingSiteRepositoryService,
  TrainingSiteEvaluationRepositoryService,
} from 'repository/services';

@Injectable()
export class CourseTrainingSiteService {
  constructor(
    private readonly trainingSiteRepository: CourseTrainingSiteRepositoryService,
    private readonly trainingSiteEvaluationRepository: TrainingSiteEvaluationRepositoryService,
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

    return {
      trainingSiteId: newTrainingSite.id,
      message: 'Training site added successfully.',
    };
  }

  async createTrainingSite(
    body: CourseTrainingSiteDto,
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

    return {
      trainingSiteId: newTrainingSite.id,
      message: 'Training site added successfully.',
    };
  }

  async findExistingTrainingSite(courseId: string, departmentUnitId: string) {
    return await this.trainingSiteRepository.findOne({
      course: { id: courseId },
      departmentUnit: { id: departmentUnitId },
    });
  }

  async getAllTrainingSite(
    courseId: string,
  ): Promise<CourseTrainingSiteResponse[]> {
    const allTrainingSites = await this.trainingSiteRepository.findMany(
      {
        course: { id: courseId },
      },
      { departmentUnit: { department: { hospital: true } } },
    );

    const mappedResult = await Promise.all(
      allTrainingSites.map(async (trainingSite) => {
        const allTrainingSiteEvaluation =
          await this.trainingSiteEvaluationRepository.findMany({
            trainingSite: { id: trainingSite.id },
          });

        const { departmentUnit } = trainingSite;
        const { department } = departmentUnit;
        const { hospital } = department;
        return {
          id: trainingSite.id,
          hospital: hospital.name,
          department: department.name,
          departmentUnit: departmentUnit.name,
          totalEvaluations: allTrainingSiteEvaluation.length,
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

    await this.trainingSiteRepository.findOne({
      id: trainingSiteId,
    });

    return { message: 'Training site updated successfully.' };
  }

  public async deleteTrainingSite(
    trainingSiteId: string,
  ): Promise<ISuccessMessageResponse> {
    await this.trainingSiteRepository.delete({
      id: trainingSiteId,
    });

    return { message: 'Training site removed successfully.' };
  }

  public async getExportTrainingSites(courseId: string) {
    const trainingSites = await this.trainingSiteRepository.findMany(
      {
        course: { id: courseId },
      },
      {
        departmentUnit: { department: { hospital: true } },
        timeslots: { placements: true },
      },
    );

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
    const trainingSite = await this.trainingSiteRepository.findOne(
      {
        id: trainingSiteId,
      },
      {
        departmentUnit: { department: { hospital: true } },
        timeslots: true,
      },
    );

    return trainingSite;
  }

  public async getTrainingSiteSupervisor(trainingSiteId: string) {
    const trainingSite = await this.trainingSiteRepository.findOne(
      {
        id: trainingSiteId,
      },
      { departmentUnit: { departmentSupervisor: { supervisor: true } } },
    );

    const mappedSupervisor = (
      trainingSite.departmentUnit.departmentSupervisor as any
    ).map(({ supervisor }) => supervisor);

    return mappedSupervisor;
  }
}
