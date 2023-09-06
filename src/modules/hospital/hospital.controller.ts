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

import { HospitalDto } from './dto';
import { HospitalService } from './hospital.service';

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
  async findAllHospital() {
    return await this.hospitalService.getAllHospital();
  }

  @Get('authority')
  async queryAllHospital(@Query() query) {
    const authorityIds = query.authorityIds.split(' ');
    return await this.hospitalService.findAllHospital(authorityIds);
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
