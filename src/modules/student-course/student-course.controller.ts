import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import { StudentCourseService } from './student-course.service';
import { AssignCoursesToStudentDto, AssignStudentsToCourseDto } from './dto';

@ApiTags('student-course')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ErrorInterceptor)
@Controller('student-course')
export class StudentCourseController {
  constructor(private readonly studentCourseService: StudentCourseService) {}

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post('assign-students')
  async assignStudents(@Body() body: AssignStudentsToCourseDto) {
    return this.studentCourseService.assignStudents(body);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post('assign-courses')
  async assignCourses(@Body() body: AssignCoursesToStudentDto) {
    return this.studentCourseService.assignCourses(body);
  }

  @Roles(UserRoleEnum.STUDENT)
  @Get('student')
  async queryAssignedCourses(@Req() req) {
    const userId = req.user.id;
    return await this.studentCourseService.findStudentCourses(userId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('student/:studentId')
  async queryStudentAssignedCourses(
    @Param() { studentId }: { studentId: string },
  ) {
    return await this.studentCourseService.findStudentCourses(studentId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('course/:courseId')
  async queryCourseAssignedStudents(
    @Param() { courseId }: { courseId: string },
  ) {
    return await this.studentCourseService.findCourseStudents(courseId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Delete(':courseId/:studentId')
  async deleteStudentFromCourse(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    return await this.studentCourseService.deleteCourseStudent(
      courseId,
      studentId,
    );
  }
}
