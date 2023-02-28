import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { CoursesService } from './courses.service';
import { CourseTrainingSiteDto } from './dto/course-training-site.dto';
import {
  CreateCourseDto,
  SelfCreateCourseDto,
  UpdateCourseDto,
} from './dto/courses.dto';
import { ExportCourseDataDto } from './dto/export-course.dto';

@ApiTags('course')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('course')
export class CoursesController {
  constructor(private readonly coursesServices: CoursesService) {}

  @Roles(Role.ADMIN)
  @Post()
  async saveCourse(@Body() body: CreateCourseDto): Promise<any> {
    return await this.coursesServices.createCourse({
      ...body,
    });
  }

  @Roles(Role.CLINICAL_COORDINATOR)
  @Post('self')
  async selfSaveCourse(
    @Body() body: SelfCreateCourseDto,
    @Req() req,
  ): Promise<any> {
    const userId = req.user.id;
    return await this.coursesServices.createCourse({
      ...body,
      coordinatorId: userId,
    });
  }

  @Post('training-site')
  @Roles(Role.CLINICAL_COORDINATOR, Role.ADMIN)
  async addTrainingSite(@Body() body: CourseTrainingSiteDto) {
    return this.coursesServices.addTrainingSite(body);
  }

  @Post('export')
  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  async exportCourse(@Body() body: ExportCourseDataDto) {
    return this.coursesServices.exportCourseData(body);
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAllCourses(): Promise<any> {
    return await this.coursesServices.allCourses();
  }

  @Roles(Role.CLINICAL_COORDINATOR, Role.ADMIN)
  @Get('coordinator')
  async getOwnCourses(@Req() req): Promise<any> {
    return await this.coursesServices.allCoordinatorCourses(req.user.id);
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Get('department/:departmentId')
  async queryAllCourses(
    @Param() { departmentId }: { departmentId: string },
  ): Promise<any> {
    return await this.coursesServices.findAllCourses(departmentId);
  }

  @Get(':courseId/training-sites')
  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  async queryAllTrainingSites(@Param('courseId') courseId: string) {
    return await this.coursesServices.getAllTrainingSite(courseId);
  }

  @Get('training-site/:trainingSiteId')
  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  async queryTrainingSite(@Param('trainingSiteId') trainingSiteId: string) {
    return await this.coursesServices.getTrainingSite(trainingSiteId);
  }
  @Get('training-site/:trainingSiteId/supervisor')
  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  async queryAllTrainingSiteSupervisor(
    @Param('trainingSiteId') trainingSiteId: string,
  ) {
    return await this.coursesServices.getTrainingSiteSupervisor(trainingSiteId);
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Get(':id')
  async queryOneCourse(@Param('id') id: string): Promise<any> {
    return await this.coursesServices.findOneCourse(id);
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Put()
  async updateCourse(@Body() body: UpdateCourseDto): Promise<any> {
    return await this.coursesServices.updateCourse(body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteCourse(@Param('id') id: string): Promise<any> {
    return await this.coursesServices.deleteCourse(id);
  }
}
