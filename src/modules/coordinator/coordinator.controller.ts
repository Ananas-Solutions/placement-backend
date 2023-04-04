import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import { CoordinatorService } from './coordinator.service';
import { CreateCoordinatorDto, UpdateCoordinatorDto } from './dto';

@ApiTags('coordinator')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ErrorInterceptor)
@Controller('coordinator')
export class CoordinatorController {
  constructor(private coordinatorService: CoordinatorService) {}

  @Roles(UserRoleEnum.ADMIN)
  @Post()
  async createCoordinator(@Req() req, @Body() body: CreateCoordinatorDto) {
    return this.coordinatorService.saveCoordinator(body);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Get('admin/all')
  async getAllCoordinators() {
    return this.coordinatorService.getAllCoordinators();
  }

  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  @Get('self/department')
  async getCoordinatorDepartmentBySelf(@Req() req) {
    return this.coordinatorService.findCoordinatorDepartment(req.user.id);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Get('admin/:coordinatorId/department')
  async getCoordinatorDepartmentByAdmin(
    @Param('coordinatorId') coordinatorId: string,
  ) {
    return this.coordinatorService.findCoordinatorDepartment(coordinatorId);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Get('admin/:coordinatorId')
  async getCoordinator(@Param('coordinatorId') coordinatorId: string) {
    return this.coordinatorService.findCoordinator(coordinatorId);
  }

  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  @Put(':id')
  async updateCoordinator(
    @Param('id') id: string,
    @Body() body: UpdateCoordinatorDto,
  ) {
    return this.coordinatorService.updateCoordinator(id, body);
  }
}
