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

import { HospitalDto, QueryAuthorityHospitalDto } from './dto';
import { HospitalService } from './hospital.service';
import { SearchQueryDto } from 'commons/dto';

@ApiTags('hospital')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  async createHospital(@Body() body: HospitalDto) {
    return await this.hospitalService.saveHospital(body);
  }

  @Get()
  async findAllHospital(@Query() query: SearchQueryDto) {
    return await this.hospitalService.getAllHospital(query);
  }

  @Get('authority')
  async queryAllHospital(@Query() query: QueryAuthorityHospitalDto) {
    return await this.hospitalService.findAllHospital(query);
  }

  @Get(':id')
  async queryOneHospital(@Param('id') id: string) {
    return await this.hospitalService.findOneHospital(id);
  }

  @Put(':id')
  async updateHospital(@Param('id') id: string, @Body() body: HospitalDto) {
    return await this.hospitalService.updateOneHospital(id, body);
  }

  @Delete(':id')
  async deleteHospital(@Param('id') id: string) {
    return await this.hospitalService.deleteOneHospital(id);
  }
}
