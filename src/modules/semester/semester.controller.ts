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
@Roles(UserRoleEnum.ADMIN)
@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  async createSemester(@Body() body: SemesterDto) {
    return await this.semesterService.save(body);
  }

  @Get(':id')
  async getOneSemester(@Param('id') id: string) {
    return await this.semesterService.findOne(id);
  }

  @Get()
  async getAllSemester() {
    return await this.semesterService.findAll();
  }

  @Put(':id')
  async updateSemester(@Param('id') id: string, @Body() body: SemesterDto) {
    return await this.semesterService.update(id, body);
  }

  @Delete(':id')
  async deleteSemester(@Param('id') id: string) {
    return await this.semesterService.delete(id);
  }
}
