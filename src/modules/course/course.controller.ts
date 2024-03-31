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
  AddStudentToBlockDto,
  CourseBlockTrainingSiteDto,
  CourseTrainingSiteDto,
  CreateBlockDto,
  CreateCourseDto,
  ExportCourseDataDto,
  ImportCourseSettingDto,
  TransferCourseSettingDto,
  TransferStudentToCourseDto,
  updateCourseBlockDto,
} from './dto';
import { CourseTrainingSiteService } from './services/course-training-site.service';
import { CourseTransferService } from './services/course-transfer.service';
import { CourseExportService } from './services/course-export.service';

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

  @Post('training-site')
  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  async addTrainingSite(@Body() body: CourseTrainingSiteDto) {
    return this.courseTrainingSiteService.addTrainingSite(body);
  }

  @Post('block/training-site')
  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  async addBlockTrainingSite(@Body() body: CourseBlockTrainingSiteDto) {
    return this.courseTrainingSiteService.addBlockTrainingSite(body);
  }

  @Post('export')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async exportCourse(@Body() body: ExportCourseDataDto, @Res() res: Response) {
    return this.courseExportService.exportCourseData(body, res);
  }

  @Post('add-student')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async addStudent(@Body() body: AddStudentDto) {
    return this.coursesServices.addStudent(body);
  }

  @Post('add-student-to-block')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async addStudentToBlock(@Body() body: AddStudentToBlockDto) {
    return this.coursesServices.addStudentToBlock(body);
  }

  @Post('block')
  @Roles(UserRoleEnum.ADMIN)
  async addBlocks(@Body() body: CreateBlockDto) {
    return this.coursesServices.addBlocks(body);
  }

  @Post('transfer-students')
  @Roles(UserRoleEnum.ADMIN)
  async transferStudentsToCourse(@Body() body: TransferStudentToCourseDto) {
    return this.courseTransferService.transferStudentsToCourse(body);
  }

  @Post('transfer-settings')
  @Roles(UserRoleEnum.ADMIN)
  async transferCourseSettings(@Body() body: TransferCourseSettingDto) {
    return this.courseTransferService.transferCourseSetting(body);
  }

  @Post('import-settings-to-block')
  @Roles(UserRoleEnum.ADMIN)
  async importCourseSettings(@Body() body: ImportCourseSettingDto) {
    return this.courseTransferService.importCourseSetting(body);
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

  @Get('block-training-site/:blockTrainingSiteId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async queryBlockTrainingSite(
    @Param('blockTrainingSiteId') blockTrainingSiteId: string,
  ) {
    return await this.courseTrainingSiteService.getBlockTrainingSite(
      blockTrainingSiteId,
    );
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

  @Get('block/:blockId/training-sites')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async queryAllBlockTrainingSites(@Param('blockId') blockId: string) {
    return await this.courseTrainingSiteService.getAllBlockTrainingSite(
      blockId,
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
  @Roles(UserRoleEnum.ADMIN)
  async getCourseBlocks(@Param('courseId') courseId: string) {
    return await this.coursesServices.getCourseBlocks(courseId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('block/:id')
  async queryOneBlock(@Param('id') id: string) {
    return await this.coursesServices.findOneCourseBlock(id);
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

  @Put('block/:blockId')
  @Roles(UserRoleEnum.ADMIN)
  async updateBlock(
    @Param('blockId') blockId: string,
    @Body() body: updateCourseBlockDto,
  ) {
    return await this.coursesServices.updateBlock(blockId, body);
  }

  @Put('block/training-site/:trainingSiteId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async updateBlockTrainingSite(
    @Param('trainingSiteId') trainingSiteId: string,
    @Body() body: CourseBlockTrainingSiteDto,
  ) {
    return await this.courseTrainingSiteService.updateBlockTrainingSite(
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

  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  @Delete('block/training-site/:trainingSiteId')
  async deleteBlockTrainingSite(
    @Param('trainingSiteId') trainingSiteId: string,
  ) {
    return await this.courseTrainingSiteService.deleteBlockTrainingSite(
      trainingSiteId,
    );
  }

  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return await this.coursesServices.deleteCourse(id);
  }
}
