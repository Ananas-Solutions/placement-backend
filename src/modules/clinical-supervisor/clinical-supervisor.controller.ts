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

import { SupervisorService } from './clinical-supervisor.service';
import { SupervisorProfileDto } from './dto/supervisor-profile.dto';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';

@ApiTags('clinical supervisor')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('supervisor')
export class SupervisorController {
  constructor(private readonly supervisorService: SupervisorService) {}

  @Post()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async createSupervisorAccount(@Body() body: CreateSupervisorDto) {
    return this.supervisorService.createSupervisor(body);
  }

  @Post('profile')
  @Roles(UserRoleEnum.CLINICAL_SUPERVISOR)
  async createProfile(
    @Req() req: any,
    @Body() body: SupervisorProfileDto,
  ): Promise<any> {
    const { id } = req.user;
    return this.supervisorService.saveSupervisorProfile(id, body);
  }

  @Put('profile')
  @Roles(UserRoleEnum.CLINICAL_SUPERVISOR)
  async updateProfile(
    @Req() req: any,
    @Body() body: SupervisorProfileDto,
  ): Promise<any> {
    const { id } = req.user;
    return this.supervisorService.updateSupervisorProfile(id, body);
  }

  @Get('time-slot')
  @Roles(UserRoleEnum.CLINICAL_SUPERVISOR)
  async getTimeSlots(@Req() req) {
    const { id } = req.user;
    return this.supervisorService.fetchAllTimeSlots(id);
  }

  @Get('admin/:supervisorId/time-slot')
  @Roles(UserRoleEnum.ADMIN)
  async getSupervisorTimeSlotsByAdmin(
    @Param('supervisorId') supervisorId: string,
  ) {
    return this.supervisorService.fetchAllTimeSlots(supervisorId);
  }

  @Get('time-slot/:timeSlotId')
  @Roles(UserRoleEnum.CLINICAL_SUPERVISOR)
  async getOneTimeSlot(@Param('timeSlotId') timeSlotId: string) {
    return this.supervisorService.fetchOneTimeSlot(timeSlotId);
  }
}
