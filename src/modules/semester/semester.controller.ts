import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';

import { UserRoleEnum } from 'commons/enums';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import { SemesterDto } from './dto';
import { SemesterService } from './semester.service';

@ApiTags('semester')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Roles(UserRoleEnum.ADMIN)
  @Post()
  async createSemester(@Body() body: SemesterDto) {
    return await this.semesterService.save(body);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get(':id')
  async getOneSemester(@Param('id') id: string) {
    return await this.semesterService.findOne(id);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get()
  async getAllSemester() {
    return await this.semesterService.findAll();
  }

  @Roles(UserRoleEnum.ADMIN)
  @Put(':id')
  async updateSemester(@Param('id') id: string, @Body() body: SemesterDto) {
    return await this.semesterService.update(id, body);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  async deleteSemester(@Param('id') id: string) {
    return await this.semesterService.delete(id);
  }
}
