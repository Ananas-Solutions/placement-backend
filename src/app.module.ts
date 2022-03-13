import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SupervisorModule } from './clinical-supervisor/clinical-supervisor.module';
import { HospitalModule } from './hospital/hospital.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { CoursesModule } from './courses/courses.module';
import { AuthorityModule } from './authority/authority.module';
import { DepartmentModule } from './department/department.module';
import { StudentCourseModule } from './student-course/student-course.module';
import { StudentModule } from './student/student.module';
import { CoordinatorModule } from './coordinator/coordinator.module';
import { CoordinatorCourseModule } from './coordinator-course/coordinator-course.module';
import { CollegeDepartmentModule } from './college-department/college-department.module';
import { DepartmentUnitsModule } from './department-units/department-units.module';
import { SemesterModule } from './semester/semester.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CoordinatorCollegeDepartmentModule } from './coordinator-college-department/coordinator-college-department.module';
import { TrainingSiteModule } from './training-site/training-site.module';
import { TrainingSiteTimeSlotModule } from './training-site-time-slot/training-site-time-slot.module';
import { PlacementModule } from './placement/placement.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
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
    CoordinatorCourseModule,
    CollegeDepartmentModule,
    DepartmentUnitsModule,
    SemesterModule,
    CloudinaryModule,
    CoordinatorCollegeDepartmentModule,
    TrainingSiteModule,
    TrainingSiteTimeSlotModule,
    PlacementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
