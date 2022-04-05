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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { CoordinatorCourseService } from './coordinator-course.service';
import { AssignCoursesToCoordinator } from './dto/coordinator-course.dto';
import { CoordinatorSelfAssignCoursesDto } from './dto/coordinator-self-assign-courses.dto';

@ApiTags('coordinator-course')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ErrorInterceptor)
@Controller('coordinator-course')
export class CoordinatorCourseController {
  constructor(private coordinatorCourseService: CoordinatorCourseService) {}

  @Roles(Role.COORDINATOR)
  @Post('self-assign')
  async coordinatorCourseSelfAssign(
    @Req() req,
    @Body() body: CoordinatorSelfAssignCoursesDto,
  ): Promise<any> {
    return await this.coordinatorCourseService.assignCoursesToCoordinator({
      coordinator: req.user.id,
      courses: body.courses,
    });
  }

  @Roles(Role.ADMIN)
  @Post('assign')
  async assignCoursesToCoordinator(
    @Body() body: AssignCoursesToCoordinator,
  ): Promise<any> {
    return await this.coordinatorCourseService.assignCoursesToCoordinator(body);
  }

  @Roles(Role.COORDINATOR)
  @Get('coordinator')
  async queryAssignedCourses(@Req() req): Promise<any> {
    return await this.coordinatorCourseService.findCoordinatorCourses(
      req.user.id,
    );
  }

  @Roles(Role.ADMIN)
  @Get('coordinator/:coordinatorId')
  async queryCoordinatorCourses(
    @Param() { coordinatorId }: { coordinatorId: string },
  ): Promise<any> {
    return await this.coordinatorCourseService.findCoordinatorCourses(
      coordinatorId,
    );
  }

  @Roles(Role.ADMIN)
  @Get('course/:courseId')
  async queryCourseCoordinators(
    @Param() { courseId }: { courseId: string },
  ): Promise<any> {
    return await this.coordinatorCourseService.findCourseCoordinators(courseId);
  }
}
