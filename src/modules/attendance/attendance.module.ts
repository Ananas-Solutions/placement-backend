import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingSiteAttendanceEntity } from 'entities/training-site-attendance.entity';
import { UserModule } from 'user/user.module';

import { AttendanceController } from './attendance.controller';
import { AttendanceCommandService } from './services/attendance-command.service';
import { AttendanceQueryService } from './services/attendance-query.service';
import { CourseTrainingSiteEntity } from 'entities/course-training-site.entity';
import { UserEntity } from 'entities/user.entity';
import { CourseBlockTrainingSiteEntity } from 'entities/block-training-site.entity';
import { AttendanceExportService } from './services/attendance-export.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrainingSiteAttendanceEntity,
      CourseBlockTrainingSiteEntity,
      CourseTrainingSiteEntity,
      UserEntity,
    ]),
    UserModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceCommandService,
    AttendanceQueryService,
    AttendanceExportService,
  ],
})
export class AttendanceModule {}
