import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadService } from 'src/helpers/file-uploader.service';
import { StudentCourseModule } from 'src/student-course/student-course.module';
import { UserModule } from 'src/user/user.module';
import { StudentProfile } from './entity/student-profile.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentProfile]),
    UserModule,
    StudentCourseModule,
  ],
  controllers: [StudentController],
  providers: [StudentService, FileUploadService],
})
export class StudentModule {}
