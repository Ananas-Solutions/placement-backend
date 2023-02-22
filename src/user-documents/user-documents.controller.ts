import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { FileUploadService } from 'src/helpers/file-uploader.service';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { DocumentVerifyDto } from './dto/document-verify.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UserDocuments } from './entity/user-documents.entity';
import { UserDocumentsService } from './user-documents.service';

@ApiTags('user-documents')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user-documents')
export class UserDocumentsController {
  constructor(
    private readonly documentService: UserDocumentsService,
    private readonly fileUpload: FileUploadService,
  ) {}

  @Roles(Role.STUDENT)
  @Post()
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocuments(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDocumentDto,
  ) {
    const uploadedFile = await this.fileUpload.uploadFile(
      file.buffer,
      file.originalname,
    );
    return await this.documentService.uploadDocuments(
      req.user.id,
      uploadedFile.fileUrl,
      body,
    );
  }

  @Roles(Role.STUDENT)
  @Get()
  async viewUploadDocuments(@Req() req): Promise<any> {
    return await this.documentService.getUserDocuments(req.user.id);
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Post('verify/:documentId')
  async verifyDocument(
    @Param('documentId') documentId: string,
    @Body() body: DocumentVerifyDto,
  ): Promise<any> {
    return await this.documentService.verifyDocument(documentId, body);
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Get('user/:userId')
  async userDocuments(
    @Param('userId') userId: string,
  ): Promise<UserDocuments[]> {
    return await this.documentService.getUserDocuments(userId);
  }
}
