import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { UserModule } from 'user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalEntity } from 'entities/hospital.entity';
import { DepartmentUnitEntity } from 'entities/department-units.entity';
import { DepartmentEntity } from 'entities/department.entity';
import { UserEntity } from 'entities/user.entity';
import { StudentCourseEntity } from 'entities/student-course.entity';
import { CourseEntity } from 'entities/courses.entity';
import { AuthorityEntity } from 'entities/authority.entity';
import { CollegeDepartmentEntity } from 'entities/college-department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthorityEntity,
      HospitalEntity,
      DepartmentUnitEntity,
      DepartmentEntity,
      UserEntity,
      StudentCourseEntity,
      CourseEntity,
      CollegeDepartmentEntity,
    ]),
    UserModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
