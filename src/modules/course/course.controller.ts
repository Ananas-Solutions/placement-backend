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

import { CourseService } from './services/course.service';
import {
  AddStudentDto,
  CourseTrainingSiteDto,
  CreateCourseDto,
  ExportCourseDataDto,
  TransferCourseSettingDto,
  TransferStudentToCourseDto,
} from './dto';
import { CourseTrainingSiteService } from './services/course-training-site.service';

@ApiTags('course')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('course')
export class CourseController {
  constructor(
    private readonly coursesServices: CourseService,
    private readonly courseTrainingSiteService: CourseTrainingSiteService,
  ) {}

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post()
  async saveCourse(@Req() req, @Body() body: CreateCourseDto) {
    const userId = req.user.id;
    return await this.coursesServices.createCourse(userId, body);
  }

  @Post('training-site')
  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  async addTrainingSite(@Body() body: CourseTrainingSiteDto) {
    return this.courseTrainingSiteService.addTrainingSite(body);
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

  @Post('transfer-students')
  @Roles(UserRoleEnum.ADMIN)
  async transferStudentsToCourse(@Body() body: TransferStudentToCourseDto) {
    return this.coursesServices.transferStudentsToCourse(body);
  }

  @Post('transfer-settings')
  @Roles(UserRoleEnum.ADMIN)
  async transferCourseSettings(@Body() body: TransferCourseSettingDto) {
    return this.coursesServices.transferCourseSetting(body);
  }

  @Get('export/training-sites/:courseId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async getExportTrainingSites(@Param('courseId') courseId: string) {
    return this.courseTrainingSiteService.getExportTrainingSites(courseId);
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
    return await this.courseTrainingSiteService.getTrainingSite(trainingSiteId);
  }

  @Get('training-site/:trainingSiteId/supervisor')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async queryAllTrainingSiteSupervisor(
    @Param('trainingSiteId') trainingSiteId: string,
  ) {
    return await this.courseTrainingSiteService.getTrainingSiteSupervisor(
      trainingSiteId,
    );
  }

  @Get(':courseId/training-sites')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async queryAllTrainingSites(@Param('courseId') courseId: string) {
    return await this.courseTrainingSiteService.getAllTrainingSite(courseId);
  }

  @Get(':courseId/students')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async getCourseStudents(@Param('courseId') courseId: string) {
    return await this.coursesServices.findCourseStudents(courseId);
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

  @Put('training-site/:trainingSiteId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async updateCourseTrainingSite(
    @Param('trainingSiteId') trainingSiteId: string,
    @Body() body: CourseTrainingSiteDto,
  ) {
    return await this.courseTrainingSiteService.updateTrainingSite(
      trainingSiteId,
      body,
    );
  }

  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  @Delete('training-site/:trainingSiteId')
  async deleteTrainingSite(@Param('trainingSiteId') trainingSiteId: string) {
    return await this.courseTrainingSiteService.deleteTrainingSite(
      trainingSiteId,
    );
  }

  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return await this.coursesServices.deleteCourse(id);
  }
}
