import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { DocumentVerifyDto } from './dto/document-verify.dto';
import { UserDocuments } from './entity/user-documents.entity';
import { DocumentVerificationEnum } from './types/document-verification.type';
import { UserDocumentsService } from './user-documents.service';

@ApiTags('user-documents')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user-documents')
export class UserDocumentsController {
  constructor(private readonly documentService: UserDocumentsService) {}

  @Roles(Role.STUDENT)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async uploadDocuments(
    @Req() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    return await this.documentService.uploadDocuments(req.user.id, files);
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
