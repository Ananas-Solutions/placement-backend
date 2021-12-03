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
import { CoordinatorService } from './coordinator.service';
import { AssignCourseToStudentDto } from './dto/assing-course-to-student.dto';
import { CoordinatorProfileDto } from './dto/coordinator-profile.dto';

@ApiTags('coordinator')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COORDINATOR)
@UseInterceptors(ErrorInterceptor)
@Controller('coordinator')
export class CoordinatorController {
  constructor(private coordinatorService: CoordinatorService) {}

  @Post('profile')
  async createProfile(
    @Req() req,
    @Body() body: CoordinatorProfileDto,
  ): Promise<any> {
    return await this.coordinatorService.saveProfile(req.user.id, body);
  }

  @Get('profile')
  async queryProfile(@Req() req): Promise<any> {
    return await this.coordinatorService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(
    @Req() req,
    @Body() body: CoordinatorProfileDto,
  ): Promise<any> {
    return await this.coordinatorService.updateProfile(req.user.id, body);
  }
}
