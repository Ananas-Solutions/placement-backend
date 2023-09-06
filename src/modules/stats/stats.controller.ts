import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ErrorInterceptor)
export class StatsController {
  constructor(private readonly statService: StatsService) {}

  @Get()
  @Roles(UserRoleEnum.ADMIN)
  async getAdminStats() {
    return this.statService.getStatsForAdmin();
  }

  @Get('coordinator')
  @Roles(UserRoleEnum.CLINICAL_COORDINATOR)
  async getCoordinatorStats(@Req() req) {
    return this.statService.getStatsForCoordinator(req.user.id);
  }
}
