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
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ErrorInterceptor } from 'interceptor/error.interceptor';
import { UserRoleEnum } from 'commons/enums';
import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';

import { CourseService } from '../services/course.service';
import {
  AddStudentDto,
  CourseTrainingSiteDto,
  CreateCourseDto,
  DefineCourseBlockDto,
  ExportCourseDataDto,
  SaveCourseGridViewDto,
  TransferAndShuffleCourseSettingDto,
  TransferCourseSettingDto,
  TransferStudentToCourseDto,
} from '../dto';
import { CourseTrainingSiteService } from '../services/course-training-site.service';
import { CourseTransferService } from '../services/course-transfer.service';
import { CourseExportService } from '../services/course-export.service';
import { SearchQueryDto } from 'commons/dto';

@ApiTags('course')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('course')
export class CourseController {
  constructor(
    private readonly coursesServices: CourseService,
    private readonly courseTrainingSiteService: CourseTrainingSiteService,
    private readonly courseTransferService: CourseTransferService,
    private readonly courseExportService: CourseExportService,
  ) {}

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post()
  async saveCourse(@Req() req, @Body() body: CreateCourseDto) {
    const userId = req.user.id;
    return await this.coursesServices.createCourse(userId, body);
  }

  @Post('save-grid-view')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async saveCourseGridView(@Body() body: SaveCourseGridViewDto) {
    return await this.coursesServices.saveCourseGridView(body);
  }

  @Get('get-grid-view/:courseId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async getCourseGridView(@Param('courseId') courseId: string) {
    return await this.coursesServices.getCourseGridView(courseId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post('define-block')
  async defineCourseBlock(@Body() body: DefineCourseBlockDto) {
    return await this.coursesServices.defineCourseBlock(body);
  }

  @Post('training-site')
  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  async addTrainingSite(@Body() body: CourseTrainingSiteDto) {
    return this.courseTrainingSiteService.addTrainingSite(body);
  }

  @Post('add-student')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async addStudent(@Body() body: AddStudentDto) {
    return this.coursesServices.addStudent(body);
  }

  @Post('export')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async exportCourse(@Body() body: ExportCourseDataDto, @Res() res: Response) {
    return this.courseExportService.exportCourseData(body, res);
  }

  @Post('transfer-students')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async transferStudentsToCourse(@Body() body: TransferStudentToCourseDto) {
    return this.courseTransferService.transferStudentsToCourse(body);
  }

  @Post('transfer-settings')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async transferCourseSettings(@Body() body: TransferCourseSettingDto) {
    return this.courseTransferService.transferCourseSetting(body);
  }

  @Post('transfer-and-shuffle')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async importAndShuffle(@Body() body: TransferAndShuffleCourseSettingDto) {
    return this.courseTransferService.transferAndShuffleCourseSettings(body);
  }

  @Post('import-settings-to-all-blocks/:courseId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async importSettingsToAllBlocks(@Param('courseId') courseId: string) {
    return this.coursesServices.importSettingsToAllBlocks(courseId);
  }

  @Get('export/training-sites/:courseId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async getExportTrainingSites(@Param('courseId') courseId: string) {
    return this.courseTrainingSiteService.getExportTrainingSites(courseId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get()
  async getAllCourses(@Req() req, @Query() query: SearchQueryDto) {
    const { id } = req.user;
    return await this.coursesServices.allCourses(id, query);
  }

  @Roles(UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('courses-by-department')
  async getAllCoursesByDepartment(@Req() req) {
    const { id } = req.user;
    return await this.coursesServices.findAllCoursesForCoordinatorDepartment(
      id,
    );
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

  @Get(':courseId/blocks')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async getCourseBlocks(@Param('courseId') courseId: string) {
    return await this.coursesServices.getCourseBlocks(courseId);
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

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return await this.coursesServices.deleteCourse(id);
  }
}
