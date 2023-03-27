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
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ErrorInterceptor } from 'interceptor/error.interceptor';
import { UserRoleEnum } from 'commons/enums';
import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';

import { CourseService } from './course.service';
import {
  AddStudentDto,
  CourseTrainingSiteDto,
  CreateCourseDto,
  ExportCourseDataDto,
} from './dto';

@ApiTags('course')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly coursesServices: CourseService) {}

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post()
  async saveCourse(@Req() req, @Body() body: CreateCourseDto) {
    const userId = req.user.id;
    return await this.coursesServices.createCourse(userId, body);
  }

  @Post('training-site')
  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  async addTrainingSite(@Body() body: CourseTrainingSiteDto) {
    return this.coursesServices.addTrainingSite(body);
  }

  @Post('export')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async exportCourse(@Body() body: ExportCourseDataDto, @Res() res: Response) {
    return this.coursesServices.exportCourseData(body, res);
  }

  @Post('add-student')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async addStudent(@Body() body: AddStudentDto) {
    return this.coursesServices.addStudent(body);
  }

  @Get('export/training-sites/:courseId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async getExportTrainingSites(@Param('courseId') courseId: string) {
    return this.coursesServices.getExportTrainingSites(courseId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get()
  async getAllCourses(@Req() req) {
    const { id } = req.user;
    return await this.coursesServices.allCourses(id);
  }

  @Get('training-site/:trainingSiteId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async queryTrainingSite(@Param('trainingSiteId') trainingSiteId: string) {
    return await this.coursesServices.getTrainingSite(trainingSiteId);
  }

  @Get('training-site/:trainingSiteId/supervisor')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async queryAllTrainingSiteSupervisor(
    @Param('trainingSiteId') trainingSiteId: string,
  ) {
    return await this.coursesServices.getTrainingSiteSupervisor(trainingSiteId);
  }

  @Get(':courseId/training-sites')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async queryAllTrainingSites(@Param('courseId') courseId: string) {
    return await this.coursesServices.getAllTrainingSite(courseId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get(':id')
  async queryOneCourse(@Param('id') id: string) {
    return await this.coursesServices.findOneCourse(id);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Put(':id')
  async updateCourse(@Param('id') id: string, @Body() body: CreateCourseDto) {
    return await this.coursesServices.updateCourse(id, body);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return await this.coursesServices.deleteCourse(id);
  }
}
