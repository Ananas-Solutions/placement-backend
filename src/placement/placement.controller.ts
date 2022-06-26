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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { TrainingDaysEnum } from 'src/training-site-time-slot/types/training-site-days.enum';
import { StudentPlacementDto } from './dto/placement.dto';
import { PlacementService } from './placement.service';

@ApiTags('placement')
@Controller('placement')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlacementController {
  constructor(private readonly placementService: PlacementService) {}

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('student-availability')
  async findStudentsAvailability(
    @Query('courseId') courseId: string,
    @Query('trainingSiteId') trainingSiteId: string,
    @Query('trainingDay') trainingDay: TrainingDaysEnum,
  ) {
    return await this.placementService.findStudentsAvailability(
      courseId,
      trainingSiteId,
      trainingDay,
    );
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Post()
  async assignPlacement(@Body() body: StudentPlacementDto): Promise<any> {
    return await this.placementService.assignPlacment(body);
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('student/:studentId')
  async getStudentSites(@Param('studentId') studentId: string): Promise<any> {
    return await this.placementService.findStudentTrainingSite(studentId);
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('training-site/:trainingSiteId/group-by-day')
  async getTrainingSiteStudentsGroupByDay(
    @Param('trainingSiteId') trainingSiteId: string,
  ): Promise<any> {
    return await this.placementService.groupTrainingSiteStudentsByDay(
      trainingSiteId,
    );
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('training-site/:trainingSiteId')
  async getTrainingSiteStudents(
    @Param('trainingSiteId') trainingSiteId: string,
  ): Promise<any> {
    return await this.placementService.findTrainingSiteStudents(trainingSiteId);
  }
}
