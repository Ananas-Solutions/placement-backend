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
import {
  AssignCoursesToStudentDto,
  AssignStudentsToCourseDto,
  AutoAssignStudentsToBlockDto,
} from './dto';

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
  @Post('block/auto-assign-students')
  async autoAssignBlockStudents(@Body() body: AutoAssignStudentsToBlockDto) {
    return this.studentCourseService.autoAssignStudentsToBlocks(body);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post('assign-courses')
  async assignCourses(@Body() body: AssignCoursesToStudentDto) {
    return this.studentCourseService.assignCourses(body);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('block/:blockId')
  async getAvailableStudentsForBlock(@Param('blockId') blockId: string) {
    return this.studentCourseService.getAvailableStudentsForBlock(blockId);
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
  @Get('course/block/:blockId')
  async queryCourseBlockAssignedStudents(
    @Param() { blockId }: { blockId: string },
  ) {
    return await this.studentCourseService.findCourseBlockStudents(blockId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('course/:courseId')
  async queryCourseAssignedStudents(
    @Param() { courseId }: { courseId: string },
  ) {
    return await this.studentCourseService.findCourseStudents(courseId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Delete('block/:blockId/:studentId')
  async deleteStudentFromBlock(
    @Param('blockId') blockId: string,
    @Param('studentId') studentId: string,
  ) {
    return await this.studentCourseService.deleteBlockStudent(
      blockId,
      studentId,
    );
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
