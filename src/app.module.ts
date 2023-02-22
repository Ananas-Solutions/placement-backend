import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SupervisorModule } from './clinical-supervisor/clinical-supervisor.module';
import { HospitalModule } from './hospital/hospital.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { AuthorityModule } from './authority/authority.module';
import { DepartmentModule } from './department/department.module';
import { StudentCourseModule } from './student-course/student-course.module';
import { StudentModule } from './student/student.module';
import { CoordinatorModule } from './coordinator/coordinator.module';
import { CollegeDepartmentModule } from './college-department/college-department.module';
import { DepartmentUnitsModule } from './department-units/department-units.module';
import { SemesterModule } from './semester/semester.module';
import { CoordinatorCollegeDepartmentModule } from './coordinator-college-department/coordinator-college-department.module';
//import { TrainingSiteModule } from './training-site/training-site.module';
import { TrainingSiteTimeSlotModule } from './training-time-slot/training-time-slot.module';
import { PlacementModule } from './placement/placement.module';
import { ConfigModule } from '@nestjs/config';
import { UserDocumentsModule } from './user-documents/user-documents.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { EventsModule } from './events/events.module';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          synchronize: true,
        }),
    }),
    QueuesModule,
    UserModule,
    SupervisorModule,
    HospitalModule,
    AuthModule,
    CoursesModule,
    AuthorityModule,
    DepartmentModule,
    StudentCourseModule,
    StudentModule,
    CoordinatorModule,
    CollegeDepartmentModule,
    DepartmentUnitsModule,
    SemesterModule,
    CoordinatorCollegeDepartmentModule,
    //TrainingSiteModule,
    TrainingSiteTimeSlotModule,
    PlacementModule,
    UserDocumentsModule,
    EvaluationModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
