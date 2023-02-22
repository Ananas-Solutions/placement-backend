import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
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
import { AssignCoursesDto, AssignStudentsDto } from './dto/student-course.dto';
import { StudentCourseService } from './student-course.service';

@ApiTags('student-course')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ErrorInterceptor)
@Controller('student-course')
export class StudentCourseController {
  constructor(private readonly studentCourseService: StudentCourseService) {}

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Post('assign-students')
  async assignStudents(@Body() body: AssignStudentsDto): Promise<any> {
    return this.studentCourseService.assignStudents(body);
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Post('assign-courses')
  async assignCourses(@Body() body: AssignCoursesDto): Promise<any> {
    return this.studentCourseService.assignCourses(body);
  }

  @Roles(Role.STUDENT)
  @Get('student')
  async queryAssignedCourses(@Req() req): Promise<any> {
    const userId = req.user.id;
    return await this.studentCourseService.findStudentCourses(userId);
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Get('student/:studentId')
  async queryStudentAssignedCourses(
    @Param() { studentId }: { studentId: string },
  ): Promise<any> {
    return await this.studentCourseService.findStudentCourses(studentId);
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Get('course/:courseId')
  async queryCourseAssignedStudents(
    @Param() { courseId }: { courseId: string },
  ): Promise<any> {
    return await this.studentCourseService.findCourseStudents(courseId);
  }
}
