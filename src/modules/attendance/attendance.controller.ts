import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

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
import { AttendanceExportService } from './services/attendance-export.service';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    private readonly attendanceCommandService: AttendanceCommandService,
    private readonly attendanceQueryService: AttendanceQueryService,
    private readonly attendanceExportService: AttendanceExportService,
  ) {}

  @Post()
  @Roles(UserRoleEnum.CLINICAL_SUPERVISOR, UserRoleEnum.CLINICAL_COORDINATOR)
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

  @Post('export-student-attendace')
  @Roles(
    UserRoleEnum.ADMIN,
    UserRoleEnum.CLINICAL_COORDINATOR,
    UserRoleEnum.CLINICAL_SUPERVISOR,
  )
  async queryStudentAttendanceReportExport(
    @Body() body: QueryStudentAttendanceReportDto,
    @Res() res: Response,
  ) {
    return this.attendanceExportService.exportStudentAttendance(body, res);
  }
}
