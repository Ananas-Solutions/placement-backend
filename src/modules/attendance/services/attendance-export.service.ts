import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CourseBlockTrainingSiteEntity } from 'entities/block-training-site.entity';
import { CourseTrainingSiteEntity } from 'entities/course-training-site.entity';
import { TrainingSiteAttendanceEntity } from 'entities/training-site-attendance.entity';
import { Repository } from 'typeorm';
import { QueryStudentAttendanceReportDto } from '../dto';
import { Response } from 'express';
import { join } from 'path';

@Injectable()
export class AttendanceExportService {
  constructor(
    @InjectRepository(TrainingSiteAttendanceEntity)
    private readonly trainingSiteAttendanceRepository: Repository<TrainingSiteAttendanceEntity>,
    @InjectRepository(CourseTrainingSiteEntity)
    private readonly courseTrainingSiteRepository: Repository<CourseTrainingSiteEntity>,
    @InjectRepository(CourseBlockTrainingSiteEntity)
    private readonly courseBlockTrainingSiteRepository: Repository<CourseBlockTrainingSiteEntity>,
  ) {}

  public async exportStudentAttendance(
    body: QueryStudentAttendanceReportDto,
    response: Response,
  ) {
    // Implementation for exporting student attendance
    // immediately return a dummy data

    const filePath = join(__dirname, 'Excel.xlsx');
    response.sendFile(filePath);
  }
}
