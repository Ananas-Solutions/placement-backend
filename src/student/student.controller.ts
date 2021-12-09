import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { StudentProfileDto } from './dto/student-profile.dto';
import { StudentService } from './student.service';
import {
  identityDocumentFileFilter,
  identityDocumentFileLimit,
} from './utils/identity-document.filter';

@ApiTags('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
@UseInterceptors(ErrorInterceptor)
@Controller('student')
export class StudentController {
  constructor(
    private studentService: StudentService,
    private readonly cloudinary: CloudinaryService,
  ) {}

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

  @Put('profile')
  async updateProfile(
    @Req() req,
    @Body() body: StudentProfileDto,
  ): Promise<any> {
    return await this.studentService.updateProfile(req.user.id, body);
  }

  @Post('identity-document')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: identityDocumentFileLimit,
      fileFilter: identityDocumentFileFilter,
    }),
  )
  async updateIdentityDocument(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      if (req.fileValidationError) {
        throw new BadRequestException(req.fileValidationError);
      }
      if (!file) {
        throw new BadRequestException('Invalid file uploaded.');
      }
      const { id } = req.user;
      const cloudinaryResponse = await this.cloudinary.uploadImage(file);
      console.log(id, cloudinaryResponse.url);
      return await this.studentService.updateProfile(id, {
        identity: cloudinaryResponse.url,
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
