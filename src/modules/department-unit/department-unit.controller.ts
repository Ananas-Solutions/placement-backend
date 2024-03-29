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

import { DepartmentUnitsService } from './department-unit.service';
import { DepartmentUnitsDto } from './dto';

@ApiTags('Hospital Department Units')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('department-unit')
export class DepartmentUnitsController {
  constructor(
    private readonly departmentUnitsService: DepartmentUnitsService,
  ) {}

  @Roles(UserRoleEnum.ADMIN)
  @Post()
  async saveUnit(@Body() body: DepartmentUnitsDto) {
    return this.departmentUnitsService.save(body);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get()
  async getAllUnits() {
    return await this.departmentUnitsService.findAll();
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('department')
  async findAllUnit(@Query() query) {
    const departmentIds = query.departmentIds.split(' ');
    return this.departmentUnitsService.find(departmentIds);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get(':id')
  async findOneUnit(@Param('id') id: string) {
    return await this.departmentUnitsService.findOne(id);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Put(':id')
  async updateUnit(@Param('id') id: string, @Body() body: DepartmentUnitsDto) {
    return this.departmentUnitsService.update(id, body);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  async deletUnit(@Param('id') id: string) {
    return this.departmentUnitsService.delete(id);
  }
}
