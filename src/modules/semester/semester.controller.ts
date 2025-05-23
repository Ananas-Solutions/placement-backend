import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { SearchQueryDto } from 'commons/dto';
import { TransformResponseInterceptor } from 'interceptor/transform-response.interceptor';
import { SemesterResponse } from './response';
import { SuccessMessageResponse } from 'commons/response';
import { SimplifiedSemesterResponse } from './response/simplified-semester.response';

@ApiTags('semester')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Roles(UserRoleEnum.ADMIN)
  @Post()
  @UseInterceptors(new TransformResponseInterceptor(SemesterResponse))
  async createSemester(@Body() body: SemesterDto) {
    return await this.semesterService.save(body);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get(':id')
  @UseInterceptors(new TransformResponseInterceptor(SimplifiedSemesterResponse))
  async getOneSemester(@Param('id') id: string) {
    return await this.semesterService.findOne(id);
  }

  @Get()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @UseInterceptors(new TransformResponseInterceptor(SemesterResponse))
  async getAllSemester(@Query() query: SearchQueryDto) {
    return await this.semesterService.findAll(query);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Put(':id')
  @UseInterceptors(new TransformResponseInterceptor(SemesterResponse))
  async updateSemester(@Param('id') id: string, @Body() body: SemesterDto) {
    return await this.semesterService.update(id, body);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  @UseInterceptors(new TransformResponseInterceptor(SuccessMessageResponse))
  async deleteSemester(@Param('id') id: string) {
    return await this.semesterService.delete(id);
  }
}
