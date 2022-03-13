import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollegeDepartmentModule } from 'src/college-department/college-department.module';
import { SemesterModule } from 'src/semester/semester.module';
import { UserModule } from 'src/user/user.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Courses } from './entity/courses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Courses]), UserModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
