import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlacementEntity } from 'entities/placement.entity';
import { StudentProfileEntity } from 'entities/student-profile.entity';
import { FileUploadService } from 'helper/file-uploader.service';
import { StudentCourseModule } from 'student-course/student-course.module';
import { UserModule } from 'user/user.module';

import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentProfileEntity, PlacementEntity]),
    UserModule,
    StudentCourseModule,
  ],
  controllers: [StudentController],
  providers: [StudentService, FileUploadService],
})
export class StudentModule {}
