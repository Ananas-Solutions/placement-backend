import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { orderBy, sortBy, uniqBy } from 'lodash';
import { endOfDay, startOfDay } from 'date-fns';

import { TrainingSiteAttendanceEntity } from 'entities/training-site-attendance.entity';
import { CourseTrainingSiteEntity } from 'entities/course-training-site.entity';

import {
  QueryStudentAttendanceReportDto,
  QueryTrainingSiteAttendanceDto,
} from '../dto';
import { CourseBlockTrainingSiteEntity } from 'entities/block-training-site.entity';

@Injectable()
export class AttendanceQueryService {
  constructor(
    @InjectRepository(TrainingSiteAttendanceEntity)
    private readonly trainingSiteAttendanceRepository: Repository<TrainingSiteAttendanceEntity>,
    @InjectRepository(CourseTrainingSiteEntity)
    private readonly courseTrainingSiteRepository: Repository<CourseTrainingSiteEntity>,
    @InjectRepository(CourseBlockTrainingSiteEntity)
    private readonly courseBlockTrainingSiteRepository: Repository<CourseBlockTrainingSiteEntity>,
  ) {}

  public async queryStudentAttendance(body: QueryStudentAttendanceReportDto) {
    const { studentId, trainingSiteId, page = 1, limit = 10000 } = body;

    const startDate = startOfDay(body.startDate);
    const endDate = endOfDay(body.endDate);

    const where: FindOptionsWhere<TrainingSiteAttendanceEntity> = {
      student: { id: studentId },
      createdAt: Between(startDate, endDate),
    };

    if (trainingSiteId) {
      where.trainingSite = trainingSiteId;
    }

    const [attendance, totalItems] =
      await this.trainingSiteAttendanceRepository.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
        order: {
          student: { name: 'ASC' },
          createdAt: 'DESC',
        },
      });

    const transformedAttendance = attendance?.map((item) =>
      this.transformToAttendanceResponse(item),
    );

    const sortedAttendance = sortBy(transformedAttendance, [
      'createdAt',
      'asc',
    ]);

    return {
      studentId,
      trainingSiteId: trainingSiteId || null,
      attendance: sortedAttendance,
      metadata: {
        ...body,
        totalItems,
      },
    };
  }

  public async queryTrainingSiteAttendance(
    body: QueryTrainingSiteAttendanceDto,
  ) {
    const { trainingSiteId } = body;

    const startDate = startOfDay(body.date);
    const endDate = endOfDay(body.date);

    const trainingSite = await this.courseTrainingSiteRepository.findOne({
      where: {
        id: trainingSiteId,
      },
      loadEagerRelations: false,
      relations: ['placement', 'placement.student'],
    });

    const blockTrainingSite =
      await this.courseBlockTrainingSiteRepository.findOne({
        where: {
          id: trainingSiteId,
        },
        loadEagerRelations: false,
        relations: ['placement', 'placement.student'],
      });

    const actualTrainingSite = trainingSite || blockTrainingSite;

    const allPlacements = actualTrainingSite.placement;

    const allStudentsFromPlacement = uniqBy(
      await Promise.all(
        allPlacements
          .map(async (placement) => placement.student)
          .flat(Infinity),
      ),
      'id',
    );

    const allStudents = await Promise.all(
      allStudentsFromPlacement.map(async (student) => {
        const attendance = await this.trainingSiteAttendanceRepository.findOne({
          where: {
            trainingSite: trainingSiteId,
            student: { id: student.id },
            createdAt: Between(startDate, endDate),
          },
        });

        return {
          id: student.id,
          studentId: student.studentId.trim().toLowerCase(),
          studentName: student.name,
          attendance: attendance
            ? this.transformToAttendanceResponse(attendance)
            : null,
          createdAt: attendance?.createdAt,
        };
      }),
    );

    return {
      trainingSiteId,
      students: orderBy(allStudents, ['studentName'], 'asc'),
    };
  }

  private transformToAttendanceResponse(
    attendance: TrainingSiteAttendanceEntity,
  ) {
    const { checkInDate, checkoutDate, createdAt } = attendance;

    return {
      checkInDate,
      checkoutDate,
      createdAt,
    };
  }
}
