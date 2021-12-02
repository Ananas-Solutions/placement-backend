import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { SupervisorService } from './clinical-supervisor.service';
import { SupervisorProfileDto } from './dto/clinicalSupervisorProfile.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERVISOR)
@Controller('supervisor')
export class SupervisorController {
  constructor(private readonly supervisorService: SupervisorService) {}

  @Post()
  async createProfile(
    @Req() req: any,
    @Body() body: SupervisorProfileDto,
  ): Promise<any> {
    const { id } = req.user;
    return this.supervisorService.saveSupervisorProfile(id, body);
  }

  @Put()
  async updateProfile(
    @Req() req: any,
    @Body() body: SupervisorProfileDto,
  ): Promise<any> {
    const { id } = req.user;
    return this.supervisorService.updateSupervisorProfile(id, body);
  }
}
