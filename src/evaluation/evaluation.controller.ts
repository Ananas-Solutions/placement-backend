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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { DepartmentUnitEvaluationDto } from './dto/department-unit-evaluation.dto';
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
  @Roles(Role.CLINICAL_SUPERVISOR)
  async evaluateStudent(@Req() req, @Body() body: StudentEvaluationDto) {
    const { id } = req.user;
    return await this.evaluationService.evaluateStudent(id, body);
  }

  @Post('department-unit')
  @Roles(Role.STUDENT)
  async evaluateDepartmentUnit(
    @Req() req,
    @Body() body: DepartmentUnitEvaluationDto,
  ) {
    const { id } = req.user;
    return await this.evaluationService.evaluateDepartmentUnit(id, body);
  }

  @Post('supervisor')
  @Roles(Role.STUDENT)
  async evaluateSupervisor(@Req() req, @Body() body: SupervisorEvaluationDto) {
    const { id } = req.user;
    return await this.evaluationService.evaluateSupervisor(id, body);
  }

  @Get('view/evaluated/students/:courseId')
  @Roles(Role.CLINICAL_SUPERVISOR)
  async viewEvaluatedStudents(@Req() req, @Param('courseId') courseId: string) {
    const { id } = req.user;
    return await this.evaluationService.viewEvaluatedStudents(id, courseId);
  }

  @Get('view/evaluated/supervisors/:courseId')
  @Roles(Role.STUDENT)
  async viewEvaluatedSupervisors(
    @Req() req,
    @Param('courseId') courseId: string,
  ) {
    const { id } = req.user;
    return await this.evaluationService.viewEvaluatedSupervisor(id, courseId);
  }

  @Get('view/evaluated/department-units/:courseId')
  @Roles(Role.STUDENT)
  async viewEvaluatedDepartmentUnits(
    @Req() req,
    @Param('courseId') courseId: string,
  ) {
    const { id } = req.user;
    return await this.evaluationService.viewEvaluatedDepartmentUnits(
      id,
      courseId,
    );
  }

  @Get('view/own-evaluation/student/:courseId')
  @Roles(Role.STUDENT)
  async viewOwnEvaluationByStudent(
    @Req() req,
    @Param('courseId') courseId: string,
  ) {
    const { id } = req.user;
    return await this.evaluationService.studentViewOwnEvaluation(id, courseId);
  }

  @Get('view/own-evaluation/supervisor/:courseId')
  @Roles(Role.CLINICAL_SUPERVISOR)
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
