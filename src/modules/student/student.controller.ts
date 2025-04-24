import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';
import { FileUploadService } from 'helper/file-uploader.service';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import {
  CreateBulkStudentDto,
  CreateStudentDto,
  QueryTrainingSitesDto,
  StudentProfileDto,
} from './dto';
import { StudentService } from './student.service';

@ApiTags('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  UserRoleEnum.ADMIN,
  UserRoleEnum.CLINICAL_COORDINATOR,
  UserRoleEnum.STUDENT,
)
@UseInterceptors(ErrorInterceptor)
@Controller('student')
export class StudentController {
  constructor(
    private studentService: StudentService,
    private readonly fileUpload: FileUploadService,
  ) {}

  @Post()
  async createStudent(@Body() body: CreateStudentDto) {
    return await this.studentService.saveStudent(body);
  }

  @Post('bulk-student')
  async bulkStudentCreate(@Body() body: CreateBulkStudentDto) {
    return await this.studentService.saveBulkStudent(body);
  }

  @Get('assigned-training-sites')
  async getStudentTimeSlots(@Req() req, @Query() query: QueryTrainingSitesDto) {
    return this.studentService.getStudentTimeSlots(req.user.id, query);
  }

  @Get('assigned-courses')
  async getStudentAssignedCourses(@Req() req) {
    return this.studentService.getStudentAssignedCourses(req.user.id);
  }

  @Get('profile')
  async queryProfile(@Req() req) {
    return await this.studentService.getProfile(req.user.id);
  }

  @Get('profile/:studentId')
  async queryStudentProfile(@Param('studentId') studentId: string) {
    return await this.studentService.getProfile(studentId);
  }

  @Put('profile')
  async updateProfile(@Req() req, @Body() body: StudentProfileDto) {
    return await this.studentService.updateProfile(req.user.id, body);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(@Req() req, @UploadedFile() avatar: Express.Multer.File) {
    try {
      const uploadedFileUrl = await this.fileUpload.uploadFile(
        avatar.buffer,
        avatar.originalname || `${req.user.id}-avatar`,
        avatar.mimetype,
      );
      const { id } = req.user;

      return await this.studentService.updateProfileAvatar(id, uploadedFileUrl);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
