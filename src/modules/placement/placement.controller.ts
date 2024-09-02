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
export class PlacementController {
  constructor(private readonly placementService: PlacementService) {}

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post()
  async assignPlacement(@Body() body: StudentPlacementDto): Promise<any> {
    return await this.placementService.assignPlacment(body);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post('auto-assign')
  async autoAssignPlacement(@Body() body: { courseId: string }): Promise<any> {
    return await this.placementService.autoAssignPlacement(body.courseId);
  }

  @Roles(
    UserRoleEnum.ADMIN,
    UserRoleEnum.CLINICAL_COORDINATOR,
    UserRoleEnum.CLINICAL_SUPERVISOR,
  )
  @Get('course/:courseId/student-unplaced')
  async findCourseStudentsAvailability(@Param('courseId') courseId: string) {
    return await this.placementService.findCourseStudentsAvailability(courseId);
  }

  @Roles(
    UserRoleEnum.ADMIN,
    UserRoleEnum.CLINICAL_COORDINATOR,
    UserRoleEnum.CLINICAL_SUPERVISOR,
  )
  @Get('student-availability')
  async findStudentsAvailability(
    @Query('trainingSiteId') trainingSiteId: string,
  ) {
    return await this.placementService.findStudentsAvailability(trainingSiteId);
  }

  @Roles(
    UserRoleEnum.ADMIN,
    UserRoleEnum.CLINICAL_COORDINATOR,
    UserRoleEnum.CLINICAL_SUPERVISOR,
  )
  @Get('placed-students/grid-approach/:courseId')
  async findPlacedStudents(@Param('courseId') courseId: string) {
    return await this.placementService.findPlacedStudentsInGridApproach(
      courseId,
    );
  }

  @Roles(
    UserRoleEnum.ADMIN,
    UserRoleEnum.CLINICAL_COORDINATOR,
    UserRoleEnum.CLINICAL_SUPERVISOR,
  )
  @Get('block/student-availability')
  async findBlockStudentsAvailability(
    @Query('blockTrainingSiteId') blockTrainingSiteId: string,
  ) {
    return await this.placementService.findBlockStudentsAvailability(
      blockTrainingSiteId,
    );
  }

  @Roles(
    UserRoleEnum.ADMIN,
    UserRoleEnum.CLINICAL_COORDINATOR,
    UserRoleEnum.CLINICAL_SUPERVISOR,
  )
  @Get('student/:studentId')
  async getStudentSites(@Param('studentId') studentId: string): Promise<any> {
    return await this.placementService.findStudentTrainingSite(studentId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('training-site/:trainingSiteId/group-by-day')
  async getTrainingSiteStudentsGroupByDay(
    @Param('trainingSiteId') trainingSiteId: string,
  ): Promise<any> {
    return await this.placementService.groupTrainingSiteStudentsByDay(
      trainingSiteId,
    );
  }

  @Roles(
    UserRoleEnum.ADMIN,
    UserRoleEnum.CLINICAL_COORDINATOR,
    UserRoleEnum.CLINICAL_SUPERVISOR,
  )
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

  @Roles(
    UserRoleEnum.ADMIN,
    UserRoleEnum.CLINICAL_COORDINATOR,
    UserRoleEnum.CLINICAL_SUPERVISOR,
  )
  @Get('block/training-site/:blockTrainingSiteId/:blockTimeSlotId')
  async getBlockTrainingSiteStudents(
    @Param('blockTrainingSiteId') blockTrainingSiteId: string,
    @Param('blockTimeSlotId') blockTimeSlotId: string,
  ): Promise<any> {
    return await this.placementService.findBlockTrainingSiteStudents(
      blockTrainingSiteId,
      blockTimeSlotId,
    );
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Delete('trainingSite/:placementId')
  async deleteTrainingSitePlacement(@Param('placementId') placementId: string) {
    return await this.placementService.removeStudentFromTrainingSite(
      placementId,
    );
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Delete('blockTrainingSite/:placementId')
  async deleteBlockTrainingSitePlacement(
    @Param('placementId') placementId: string,
  ) {
    return await this.placementService.removeStudentFromBlockTrainingSite(
      placementId,
    );
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Delete(':placementId')
  async deletePlacement(@Param('placementId') placementId: string) {
    return await this.placementService.removeStudentFromPlacement(placementId);
  }
}
