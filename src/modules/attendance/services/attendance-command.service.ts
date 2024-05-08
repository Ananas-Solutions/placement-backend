import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { differenceInMinutes, endOfDay, format, startOfDay } from 'date-fns';

import { TrainingSiteAttendanceEntity } from 'entities/training-site-attendance.entity';

import { RecordStudentAttendanceDto } from '../dto';

@Injectable()
export class AttendanceCommandService {
  constructor(
    @InjectRepository(TrainingSiteAttendanceEntity)
    private readonly trainingSiteAttendanceRepository: Repository<TrainingSiteAttendanceEntity>,
  ) {}

  public async recordStudentAttendance(body: RecordStudentAttendanceDto) {
    const { studentId, trainingSiteId, date } = body;

    const todayDate = new Date();
    const serverDate = format(todayDate, 'yyyy/MM/dd');

    if (serverDate !== date) {
      throw new BadRequestException('Invalid date');
    }

    let whereClause = {};

    whereClause = {
      ...whereClause,
      courseTrainingSite: { id: trainingSiteId },
      createdAt: Between(startOfDay(todayDate), endOfDay(todayDate)),
    };

    const existingAttendance =
      await this.trainingSiteAttendanceRepository.findOne({
        where: whereClause,
      });

    if (!existingAttendance) {
      await this.trainingSiteAttendanceRepository.save({
        student: { id: studentId },
        courseTrainingSite: { id: trainingSiteId },
        checkInDate: serverDate,
      });

      return { message: 'Student attendance checked in successfully.' };
    }

    if (existingAttendance.checkInDate && !existingAttendance.checkoutDate) {
      const timeDifference = differenceInMinutes(
        todayDate,
        existingAttendance.checkInDate,
      );

      if (timeDifference < 10) {
        return { message: 'Student has already checked in.' };
      }

      await this.trainingSiteAttendanceRepository.update(
        { id: existingAttendance.id },
        { checkoutDate: serverDate },
      );

      return { message: 'Student attendance checked out successfully.' };
    }

    return { message: 'Student has already checked out.' };
  }
}
