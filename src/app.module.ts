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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
