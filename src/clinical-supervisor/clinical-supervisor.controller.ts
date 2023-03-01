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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { SupervisorService } from './clinical-supervisor.service';
import { SupervisorProfileDto } from './dto/clinicalSupervisorProfile.dto';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';

@ApiTags('clinical supervisor')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('supervisor')
export class SupervisorController {
  constructor(private readonly supervisorService: SupervisorService) {}

  @Post()
  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  async createSupervisorAccount(@Body() body: CreateSupervisorDto) {
    return this.supervisorService.createSupervisor(body);
  }

  @Post('profile')
  @Roles(Role.CLINICAL_SUPERVISOR)
  async createProfile(
    @Req() req: any,
    @Body() body: SupervisorProfileDto,
  ): Promise<any> {
    const { id } = req.user;
    return this.supervisorService.saveSupervisorProfile(id, body);
  }

  @Put('profile')
  @Roles(Role.CLINICAL_SUPERVISOR)
  async updateProfile(
    @Req() req: any,
    @Body() body: SupervisorProfileDto,
  ): Promise<any> {
    const { id } = req.user;
    return this.supervisorService.updateSupervisorProfile(id, body);
  }

  @Get()
  @Roles(Role.CLINICAL_SUPERVISOR)
  async getTimeSlots(@Req() req) {
    const { id } = req.user;
    return this.supervisorService.fetchAllTimeSlots(id);
  }

  @Get('time-slot/:timeSlotId')
  @Roles(Role.CLINICAL_SUPERVISOR)
  async getOneTimeSlot(@Param('timeSlotId') timeSlotId: string) {
    return this.supervisorService.fetchOneTimeSlot(timeSlotId);
  }
}
