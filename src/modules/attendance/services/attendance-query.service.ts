import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { orderBy, sortBy } from 'lodash';
import { startOfDay } from 'date-fns';

import { TrainingSiteAttendanceEntity } from 'entities/training-site-attendance.entity';
import { CourseTrainingSiteEntity } from 'entities/course-training-site.entity';

import {
  QueryStudentAttendanceReportDto,
  QueryTrainingSiteAttendanceDto,
} from '../dto';

@Injectable()
export class AttendanceQueryService {
  constructor(
    @InjectRepository(TrainingSiteAttendanceEntity)
    private readonly trainingSiteAttendanceRepository: Repository<TrainingSiteAttendanceEntity>,
    @InjectRepository(CourseTrainingSiteEntity)
    private readonly courseTrainingSiteRepository: Repository<CourseTrainingSiteEntity>,
  ) {}

  public async queryStudentAttendance(body: QueryStudentAttendanceReportDto) {
    const { studentId, trainingSiteId } = body;

    const startDate = startOfDay(new Date(body.startDate));
    const endDate = startOfDay(new Date(body.endDate));

    const attendance = await this.trainingSiteAttendanceRepository.find({
      where: {
        student: { id: studentId },
        trainingSite: trainingSiteId,
        createdAt: Between(startDate, endDate),
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
      trainingSiteId,
      attendance: sortedAttendance,
    };
  }

  public async queryTrainingSiteAttendance(
    body: QueryTrainingSiteAttendanceDto,
  ) {
    const { trainingSiteId } = body;

    const startDate = startOfDay(new Date(body.date));
    const endDate = startOfDay(new Date(body.date));

    const trainingSite = await this.courseTrainingSiteRepository.find({
      where: { id: trainingSiteId },
      relations: { placement: { student: true } },
    });

    const allStudents = await Promise.all(
      trainingSite[0].placement.map(async (placement) => {
        const { student } = placement;

        const attendance = await this.trainingSiteAttendanceRepository.findOne({
          where: {
            trainingSite: trainingSiteId,
            student: { id: student.id },
            createdAt: Between(startDate, endDate),
          },
        });

        return {
          studentId: student.id,
          studentName: student.name,
          ...attendance,
          createdAt: attendance.createdAt ? attendance.createdAt : body.date,
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
