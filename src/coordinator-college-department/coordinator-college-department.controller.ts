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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { CoordinatorCollegeDepartmentService } from './coordinator-college-department.service';
import {
  AdminAssignCollegeDepartments,
  SelfAssignCollegeDepartments,
} from './dto/coordinator-college-department.dto';

@ApiTags('coordinator college departments')
@ApiBearerAuth('Admin or Coordinator Token')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ErrorInterceptor)
@Controller('coordinator-department')
export class CoordinatorCollegeDepartmentController {
  constructor(private readonly service: CoordinatorCollegeDepartmentService) {}

  @ApiOperation({
    summary:
      'This route is to be used when coordinator will self assign college department(s) to themselves.',
  })
  @Roles(Role.COORDINATOR)
  @Post()
  async saveDepartments(
    @Req() req,
    @Body() body: SelfAssignCollegeDepartments,
  ): Promise<any> {
    return await this.service.saveDepartments(req.user.id, body.departments);
  }

  @Roles(Role.COORDINATOR)
  @ApiOperation({
    summary:
      'This route is to be used when coordinator will find all assigned college department(s) to themselves.',
  })
  @Get()
  async getDepartments(@Req() req): Promise<any> {
    return await this.service.findDepartments(req.user.id);
  }

  @ApiOperation({
    summary:
      'This route is to be used when admin will assign college departments(s) to coordinator.',
  })
  @Roles(Role.ADMIN)
  @Post('admin')
  async assignDepartments(
    @Body() body: AdminAssignCollegeDepartments,
  ): Promise<any> {
    return await this.service.saveDepartments(
      body.coordinator,
      body.departments,
    );
  }

  @Roles(Role.ADMIN)
  @ApiOperation({
    summary:
      'This route is to be used when admin will find all assigned college department(s) to a coordinator.',
  })
  @Get('admin/coordinator/:coordinatorId')
  async getCoordinatorDepartments(
    @Param('coordinatorId') coordinatorId: string,
  ): Promise<any> {
    return await this.service.findDepartments(coordinatorId);
  }

  @Roles(Role.ADMIN)
  @ApiOperation({
    summary:
      'This route is to be used when admin will find all assigned coorindato(s) to a college department.',
  })
  @Get('admin/department/:collegeDepartmentId')
  async getDepartmentCoordinators(
    @Param('collegeDepartmentId') collegeDepartmentId: string,
  ): Promise<any> {
    return await this.service.findCoordinators(collegeDepartmentId);
  }
}
