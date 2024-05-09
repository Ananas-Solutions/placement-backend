import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { differenceInMinutes, endOfDay, format, startOfDay } from 'date-fns';

import { TrainingSiteAttendanceEntity } from 'entities/training-site-attendance.entity';

import { RecordStudentAttendanceDto } from '../dto';
import { UserEntity } from 'entities/user.entity';

@Injectable()
export class AttendanceCommandService {
  constructor(
    @InjectRepository(TrainingSiteAttendanceEntity)
    private readonly trainingSiteAttendanceRepository: Repository<TrainingSiteAttendanceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async recordStudentAttendance(body: RecordStudentAttendanceDto) {
    const { studentId, trainingSiteId, date } = body;

    const todayDate = new Date();
    const serverDate = format(todayDate, 'yyyy/MM/dd');

    if (serverDate !== date) {
      throw new BadRequestException(
        'Server date and actual date do not match. Please try again.',
      );
    }

    const studentInfo = await this.userRepository.findOne({
      where: { id: studentId },
    });

    let whereClause = {};

    whereClause = {
      ...whereClause,
      trainingSite: { id: trainingSiteId },
      createdAt: Between(startOfDay(todayDate), endOfDay(todayDate)),
    };

    const existingAttendance =
      await this.trainingSiteAttendanceRepository.findOne({
        where: whereClause,
      });

    if (!existingAttendance) {
      await this.trainingSiteAttendanceRepository.save({
        student: { id: studentId },
        trainingSite: trainingSiteId,
        checkInDate: serverDate,
      });

      return { message: `${studentInfo.name} checked in successfully.` };
    }

    if (existingAttendance.checkInDate && !existingAttendance.checkoutDate) {
      const timeDifference = differenceInMinutes(
        todayDate,
        existingAttendance.checkInDate,
      );

      if (timeDifference < 10) {
        return { message: `${studentInfo.name}  has already checked in.` };
      }

      await this.trainingSiteAttendanceRepository.update(
        { id: existingAttendance.id },
        { checkoutDate: serverDate },
      );

      return { message: `${studentInfo.name} checked out successfully.` };
    }

    return { message: `${studentInfo.name} has already checked out.` };
  }
}
