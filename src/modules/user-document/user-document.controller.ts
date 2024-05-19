import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { Roles } from 'commons/decorator/roles.decorator';
import { UserRoleEnum } from 'commons/enums';
import { FileUploadService } from 'helper/file-uploader.service';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import { DocumentVerifyDto } from './dto/document-verify.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UserDocumentService } from './user-document.service';
import { DefineUserDocumentRequirementListDto } from './dto';

@ApiTags('user-document')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user-document')
export class UserDocumentController {
  constructor(
    private readonly documentService: UserDocumentService,
    private readonly fileUpload: FileUploadService,
  ) {}

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post('define-document-requirement')
  async defineMasterList(@Body() body: DefineUserDocumentRequirementListDto) {
    return await this.documentService.defineUserDocumentRequirement(body);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('master-document-list')
  async fetchMasterList() {
    return await this.documentService.fetchMasterGlobalDocument();
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('master-course-document-list/:courseId')
  async fetchCourseMasterList(@Param('courseId') courseId: string) {
    return await this.documentService.fetchMasterCourseDocument(courseId);
  }

  @Roles(UserRoleEnum.STUDENT)
  @Get('master-list')
  async getMasterList(@Req() req) {
    return await this.documentService.getMasterList(req.user.id);
  }

  @Roles(UserRoleEnum.STUDENT)
  @Get('admin/student/:studentId/master-list')
  async getStudentMasterList(@Param('studentId') studentId: string) {
    return await this.documentService.getMasterList(studentId);
  }

  @Roles(UserRoleEnum.STUDENT)
  @Get('admin/student/:studentId/course/course-list/:courseId')
  async getStudentCourseDocument(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.documentService.getCourseMasterList(studentId, courseId);
  }

  @Roles(UserRoleEnum.STUDENT)
  @Get('admin-course-list/:courseId')
  async getCourseDocument(@Req() req, @Param('courseId') courseId: string) {
    const userId = req.user.id;

    return await this.documentService.getCourseMasterList(userId, courseId);
  }

  @Roles(UserRoleEnum.STUDENT)
  @Post()
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocuments(
    @Req() req,
    @UploadedFile() document: Express.Multer.File,
    @Body() body: UploadDocumentDto,
  ) {
    if (document) {
      const uploadedFileUrl = await this.fileUpload.uploadFile(
        document.buffer,
        document.originalname,
        document.mimetype,
      );
      body['url'] = uploadedFileUrl;
    }
    return await this.documentService.uploadDocuments(req.user.id, body);
  }

  @Get('global')
  async viewUploadedGlobalDocuments(@Req() req) {
    return await this.documentService.getUserGlobalDocuments(req.user.id);
  }

  @Get('course/:courseId')
  async viewUploadedCourseDocuments(
    @Req() req,
    @Param('courseId') courseId: string,
  ) {
    return await this.documentService.getUserCourseDocuments(
      req.user.id,
      courseId,
    );
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post('add-comments/:documentId')
  async addCommentsInDocument(
    @Param('documentId') documentId: string,
    @Body() body: DocumentVerifyDto,
  ) {
    return await this.documentService.verifyDocument(documentId, body);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post('verify/:documentId')
  async verifyDocument(
    @Param('documentId') documentId: string,
    @Body() body: DocumentVerifyDto,
  ) {
    return await this.documentService.verifyDocument(documentId, body);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('user/:userId/:courseId')
  async userGlobalDocuments(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.documentService.getUserAllDocuments(userId, courseId);
  }
}
