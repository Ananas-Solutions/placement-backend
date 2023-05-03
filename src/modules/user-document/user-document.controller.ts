import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

@ApiTags('user-document')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user-document')
export class UserDocumentController {
  constructor(
    private readonly documentService: UserDocumentService,
    private readonly fileUpload: FileUploadService,
  ) {}

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

  @Get()
  async viewUploadDocuments(@Req() req) {
    return await this.documentService.getUserDocuments(req.user.id);
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
  @Get('user/:userId')
  async userDocuments(@Param('userId') userId: string) {
    return await this.documentService.getUserDocuments(userId);
  }
}
