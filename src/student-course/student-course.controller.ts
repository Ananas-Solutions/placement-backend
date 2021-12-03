import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { AssignCourseStudentsDto } from './dto/student-course.dto';
import { StudentCourseService } from './student-course.service';

@ApiTags('student-course')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ErrorInterceptor)
@Controller('student-course')
export class StudentCourseController {
  constructor(private readonly studentCourseService: StudentCourseService) {}

  @ApiOperation({
    summary:
      'This route is to be used when admin or coordinator will assign many students to a course.',
  })
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Post('assign')
  async assignStudents(@Body() body: AssignCourseStudentsDto): Promise<any> {
    return this.studentCourseService.assignStudents(body);
  }

  @ApiOperation({
    summary:
      'This route is to be used when student will view courses assigned to them.',
  })
  @Roles(Role.STUDENT)
  @Get('student')
  async queryAssignedCourses(@Req() req): Promise<any> {
    return await this.studentCourseService.findStudentCourses(req.user.id);
  }

  @ApiOperation({
    summary:
      'This route is to be used when admin or coordinator will view courses assigned to a student.',
  })
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('student/:studentId')
  async queryStudentAssignedCourses(
    @Param() { studentId }: { studentId: string },
  ): Promise<any> {
    return await this.studentCourseService.findStudentCourses(studentId);
  }

  @ApiOperation({
    summary:
      'This route is to be used when admin or coordinator view students assigned to a course.',
  })
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('course/:courseId')
  async queryCourseAssignedStudents(
    @Param() { courseId }: { courseId: string },
  ): Promise<any> {
    return await this.studentCourseService.findCourseStudents(courseId);
  }
}
