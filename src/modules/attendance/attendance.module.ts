import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingSiteAttendanceEntity } from 'entities/training-site-attendance.entity';
import { UserModule } from 'user/user.module';

import { AttendanceController } from './attendance.controller';
import { AttendanceCommandService } from './services/attendance-command.service';
import { AttendanceQueryService } from './services/attendance-query.service';
import { CourseTrainingSiteEntity } from 'entities/course-training-site.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrainingSiteAttendanceEntity,
      CourseTrainingSiteEntity,
    ]),
    UserModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceCommandService, AttendanceQueryService],
})
export class AttendanceModule {}
