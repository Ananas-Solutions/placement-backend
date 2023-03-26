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

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';

import { ErrorInterceptor } from 'interceptor/error.interceptor';
import { CoordinatorService } from './coordinator.service';
import { CreateCoordinatorDto } from './dto';

@ApiTags('coordinator')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
@UseInterceptors(ErrorInterceptor)
@Controller('coordinator')
export class CoordinatorController {
  constructor(private coordinatorService: CoordinatorService) {}

  @Post()
  async createCoordinator(@Req() req, @Body() body: CreateCoordinatorDto) {
    return this.coordinatorService.saveCoordinator(body);
  }

  @Get('admin/:coordinatorId/department')
  async getCoordinatorDepartmentByAdmin(
    @Param('coordinatorId') coordinatorId: string,
  ) {
    return this.coordinatorService.findCoordinatorDepartment(coordinatorId);
  }

  @Get('self/department')
  async getCoordinatorDepartmentBySelf(@Req() req) {
    return this.coordinatorService.findCoordinatorDepartment(req.user.id);
  }

  // @Post('profile')
  // async createProfile(
  //   @Req() req,
  //   @Body() body: CoordinatorProfileDto,
  // ): Promise<any> {
  //   return await this.coordinatorService.saveProfile(req.user.id, body);
  // }

  // @Get('course')
  // async findCoordinatorCourse(@Req() req): Promise<any> {
  //   return await this.coordinatorService.findCoordinatorCourse(req.user.id);
  // }

  // @Get('profile')
  // async queryProfile(@Req() req): Promise<any> {
  //   return await this.coordinatorService.getProfile(req.user.id);
  // }

  // @Get('unassigned')
  // async getAllUnassignedCoordinator() {
  //   return await this.coordinatorService.getAllUnassignedCoordinator();
  // }

  // @Put('profile')
  // async updateProfile(
  //   @Req() req,
  //   @Body() body: CoordinatorProfileDto,
  // ): Promise<any> {
  //   return await this.coordinatorService.updateProfile(req.user.id, body);
  // }
}
