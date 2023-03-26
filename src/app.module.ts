import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';

import { AuthModule } from 'auth/auth.module';
import { AuthorityModule } from 'authority/authority.module';
import { CollegeDepartmentModule } from 'college-department/college-department.module';
import { CoordinatorModule } from 'coordinator/coordinator.module';
import { CourseModule } from 'course/course.module';
import { DepartmentUnitsModule } from 'department-unit/department-unit.module';
import { DepartmentModule } from 'department/department.module';
import { EvaluationModule } from 'evaluation/evaluation.module';
import { EventModule } from 'event/event.module';
import { HospitalModule } from 'hospital/hospital.module';
import { PlacementModule } from 'placement/placement.module';
import { QueuesModule } from 'queues/queues.module';
import { SemesterModule } from 'semester/semester.module';
import { StudentCourseModule } from 'student-course/student-course.module';
import { StudentModule } from 'student/student.module';
import { SupervisorModule } from 'supervisor/clinical-supervisor.module';
import { TrainingSiteTimeSlotModule } from 'training-time-slot/training-time-slot.module';
import { UserModule } from 'user/user.module';
import { UserDocumentModule } from 'user-document/user-document.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './modules/notification/notification.module';
import { WebsocketModule } from './websocket/websocket.module';

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
    CourseModule,
    AuthorityModule,
    DepartmentModule,
    StudentCourseModule,
    StudentModule,
    CoordinatorModule,
    CollegeDepartmentModule,
    DepartmentUnitsModule,
    SemesterModule,
    // CoordinatorCollegeDepartmentModule,
    TrainingSiteTimeSlotModule,
    PlacementModule,
    UserDocumentModule,
    EvaluationModule,
    EventModule,
    NotificationModule,
    WebsocketModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
