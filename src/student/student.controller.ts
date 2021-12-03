import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { StudentProfileDto } from './dto/student-profile.dto';
import { StudentService } from './student.service';

@ApiTags('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
@UseInterceptors(ErrorInterceptor)
@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

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
}
