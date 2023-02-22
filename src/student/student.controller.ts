import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
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
import { User } from 'src/user/entity/user.entity';
import {
  CreateBulkStudentDto,
  CreateStudentDto,
} from './dto/bulk-student-upload.dto';
import { StudentProfileDto } from './dto/student-profile.dto';
import { StudentService } from './student.service';
import {
  identityDocumentFileFilter,
  identityDocumentFileLimit,
} from './utils/identity-document.filter';

@ApiTags('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR, Role.STUDENT)
@UseInterceptors(ErrorInterceptor)
@Controller('student')
export class StudentController {
  constructor(
    private studentService: StudentService,
    private readonly fileUpload: FileUploadService,
  ) {}

  @Post()
  async createStudent(@Body() body: CreateStudentDto): Promise<User> {
    return await this.studentService.saveStudent(body);
  }

  @Post('bulk-student')
  async bulkStudentCreate(@Body() body: CreateBulkStudentDto): Promise<any> {
    return await this.studentService.saveBulkStudent(body);
  }

  @Post('profile')
  async createProfile(
    @Req() req,
    @Body() body: StudentProfileDto,
  ): Promise<any> {
    return await this.studentService.saveProfile(req.user.id, body);
  }

  @Get('profile')
  async queryProfile(@Req() req): Promise<any> {
    return await this.studentService.getProfile(req.user.id);
  }

  @Get('profile/:studentId')
  async queryStudentProfile(
    @Param('studentId') studentId: string,
  ): Promise<any> {
    return await this.studentService.getProfile(studentId);
  }

  @Put('profile')
  async updateProfile(
    @Req() req,
    @Body() body: StudentProfileDto,
  ): Promise<any> {
    return await this.studentService.updateProfile(req.user.id, body);
  }

  @Post('identity-document')
  @UseInterceptors(FileInterceptor('identityDocument'))
  async updateIdentityDocument(
    @Req() req,
    @UploadedFile() identityDocument: Express.Multer.File,
  ): Promise<any> {
    try {
      const uploadedFile = await this.fileUpload.uploadFile(
        identityDocument.buffer,
        identityDocument.originalname,
      );
      const { id } = req.user;

      return await this.studentService.updateProfileAssets(id, {
        identity: uploadedFile.fileUrl,
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Req() req,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<any> {
    try {
      const uploadedFile = await this.fileUpload.uploadFile(
        avatar.buffer,
        avatar.originalname,
      );
      const { id } = req.user;

      return await this.studentService.updateProfileAssets(id, {
        imageUrl: uploadedFile.fileUrl,
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
