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
import { ApiTags } from '@nestjs/swagger';

import { UserRoleEnum } from 'commons/enums';
import { Roles } from 'commons/decorator';
import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import { TrainingSiteEvaluationDto } from './dto/training-site-evaluation.dto';
import { StudentEvaluationDto } from './dto/student-evaluation.dto';
import { SupervisorEvaluationDto } from './dto/supervisor-evaluation.dto';
import { EvaluationService } from './evaluation.service';

@ApiTags('evaluation')
@UseInterceptors(ErrorInterceptor)
@Controller('evaluation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post('student')
  @Roles(UserRoleEnum.CLINICAL_SUPERVISOR)
  async evaluateStudent(@Req() req, @Body() body: StudentEvaluationDto) {
    const { id } = req.user;
    return await this.evaluationService.evaluateStudent(id, body);
  }

  @Post('training-site')
  @Roles(UserRoleEnum.STUDENT)
  async evaluateTrainingSite(
    @Req() req,
    @Body() body: TrainingSiteEvaluationDto,
  ) {
    const { id } = req.user;
    return await this.evaluationService.evaluateTrainingSite(id, body);
  }

  @Post('supervisor')
  @Roles(UserRoleEnum.STUDENT)
  async evaluateSupervisor(@Req() req, @Body() body: SupervisorEvaluationDto) {
    const { id } = req.user;
    return await this.evaluationService.evaluateSupervisor(id, body);
  }

  @Get('view/evaluated/students/:courseId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async viewEvaluatedStudents(@Req() req, @Param('courseId') courseId: string) {
    const { id } = req.user;
    return await this.evaluationService.viewEvaluatedStudents(id, courseId);
  }

  @Get('view/evaluated/supervisors/:courseId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async viewEvaluatedSupervisors(
    @Req() req,
    @Param('courseId') courseId: string,
  ) {
    const { id } = req.user;
    return await this.evaluationService.viewEvaluatedSupervisor(id, courseId);
  }

  @Get('view/evaluated/department-units/:courseId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async viewEvaluatedDepartmentUnits(
    @Req() req,
    @Param('courseId') courseId: string,
  ) {
    const { id } = req.user;
    return await this.evaluationService.viewEvaluatedTrainingSites(
      id,
      courseId,
    );
  }

  @Get('view/own-evaluation/student/:courseId')
  @Roles(UserRoleEnum.STUDENT)
  async viewOwnEvaluationByStudent(
    @Req() req,
    @Param('courseId') courseId: string,
  ) {
    const { id } = req.user;
    return await this.evaluationService.studentViewOwnEvaluation(id, courseId);
  }

  @Get('view/own-evaluation/supervisor/:courseId')
  @Roles(UserRoleEnum.CLINICAL_SUPERVISOR)
  async viewOwnEvaluationBySupervisor(
    @Req() req,
    @Param('courseId') courseId: string,
  ) {
    const { id } = req.user;
    return await this.evaluationService.supervisorViewOwnEvaluation(
      id,
      courseId,
    );
  }
}
