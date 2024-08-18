import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CourseCoordinatorEntity,
  CourseEntity,
  CourseTrainingSiteEntity,
  StudentCourseEntity,
  TrainingSiteEvaluationEntity,
} from 'entities/index.entity';
import { UserModule } from 'user/user.module';
import { TrainingSiteTimeSlotModule } from 'training-time-slot/training-time-slot.module';
import { PlacementModule } from 'placement/placement.module';

import { CourseController } from './controllers/course.controller';
import { CourseService } from './services/course.service';
import { CourseTrainingSiteService } from './services/course-training-site.service';
import { CourseExportService } from './services/course-export.service';
import { CourseTransferService } from './services/course-transfer.service';
import { CourseBlockEntity } from 'entities/course-block.entity';
import { CourseBlockTrainingSiteEntity } from 'entities/block-training-site.entity';
import { CourseBlockController } from './controllers/course-block.controller';
import { CoordinatorModule } from 'coordinator/coordinator.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseCoordinatorEntity,
      CourseTrainingSiteEntity,
      StudentCourseEntity,
      TrainingSiteEvaluationEntity,
      CourseBlockEntity,
      CourseBlockTrainingSiteEntity,
    ]),
    UserModule,
    TrainingSiteTimeSlotModule,
    PlacementModule,
    CoordinatorModule,
  ],
  controllers: [CourseController, CourseBlockController],
  providers: [
    CourseService,
    CourseTrainingSiteService,
    CourseExportService,
    CourseTransferService,
  ],
  exports: [CourseService, CourseTrainingSiteService],
})
export class CourseModule {}
