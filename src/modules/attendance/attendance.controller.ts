import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';

import {
  QueryStudentAttendanceReportDto,
  QueryTrainingSiteAttendanceDto,
  RecordStudentAttendanceDto,
} from './dto';
import { AttendanceCommandService } from './services/attendance-command.service';
import { AttendanceQueryService } from './services/attendance-query.service';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    private readonly attendanceCommandService: AttendanceCommandService,
    private readonly attendanceQueryService: AttendanceQueryService,
  ) {}

  @Post()
  @Roles(UserRoleEnum.CLINICAL_SUPERVISOR)
  async recordStudentAttendance(@Body() body: RecordStudentAttendanceDto) {
    return this.attendanceCommandService.recordStudentAttendance(body);
  }

  @Post('query-student-attendance')
  @Roles(
    UserRoleEnum.ADMIN,
    UserRoleEnum.CLINICAL_COORDINATOR,
    UserRoleEnum.CLINICAL_SUPERVISOR,
    UserRoleEnum.STUDENT,
  )
  async queryStudentAttendanceReport(
    @Body() body: QueryStudentAttendanceReportDto,
  ) {
    return this.attendanceQueryService.queryStudentAttendance(body);
  }

  @Post('query-training-site-attendance')
  @Roles(
    UserRoleEnum.ADMIN,
    UserRoleEnum.CLINICAL_COORDINATOR,
    UserRoleEnum.CLINICAL_SUPERVISOR,
  )
  async queryTrainingSiteAttendanceReport(
    @Body() body: QueryTrainingSiteAttendanceDto,
  ) {
    return this.attendanceQueryService.queryTrainingSiteAttendance(body);
  }
}
