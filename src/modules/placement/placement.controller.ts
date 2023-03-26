import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import { StudentPlacementDto } from './dto/placement.dto';
import { PlacementService } from './placement.service';

@ApiTags('placement')
@Controller('placement')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
export class PlacementController {
  constructor(private readonly placementService: PlacementService) {}

  @Get('student-availability')
  async findStudentsAvailability(
    @Query('trainingSiteId') trainingSiteId: string,
  ) {
    return await this.placementService.findStudentsAvailability(trainingSiteId);
  }

  @Post()
  async assignPlacement(@Body() body: StudentPlacementDto): Promise<any> {
    return await this.placementService.assignPlacment(body);
  }

  @Get('student/:studentId')
  async getStudentSites(@Param('studentId') studentId: string): Promise<any> {
    return await this.placementService.findStudentTrainingSite(studentId);
  }

  @Get('training-site/:trainingSiteId/group-by-day')
  async getTrainingSiteStudentsGroupByDay(
    @Param('trainingSiteId') trainingSiteId: string,
  ): Promise<any> {
    return await this.placementService.groupTrainingSiteStudentsByDay(
      trainingSiteId,
    );
  }

  @Get('training-site/:trainingSiteId/:timeSlotId')
  async getTrainingSiteStudents(
    @Param('trainingSiteId') trainingSiteId: string,
    @Param('timeSlotId') timeSlotId: string,
  ): Promise<any> {
    return await this.placementService.findTrainingSiteStudents(
      trainingSiteId,
      timeSlotId,
    );
  }

  @Delete(':placementId')
  async deletePlacement(@Param('placementId') placementId: string) {
    return await this.placementService.removeStudentFromTrainingSite(
      placementId,
    );
  }
}
