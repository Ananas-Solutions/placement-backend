import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import { DepartmentService } from './department.service';
import { DepartmentDto, QueryHospitalDepartmentDto } from './dto';
import { SearchQueryDto } from 'commons/dto';

@ApiTags('department')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Post()
  async createDepartment(@Body() body: DepartmentDto) {
    return await this.departmentService.saveDepartment(body);
  }

  @Get()
  async getAllDepartment(@Query() query: SearchQueryDto) {
    return await this.departmentService.findAllDepartments(query);
  }

  @Post('query-hospital')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Query all hospital department' })
  async queryHospitalDepartment(@Body() query: QueryHospitalDepartmentDto) {
    return await this.departmentService.findHospitalDepartments(query);
  }

  @Get(':departmentId/all-coordinators')
  async getAllCoordinators(@Param('departmentId') departmentId: string) {
    return this.departmentService.findDepartmentCoordinators(departmentId);
  }

  @Get(':id')
  async queryOneDepartment(@Param('id') id: string) {
    return await this.departmentService.findOneDepartment(id);
  }

  @Put(':id')
  async updateDepartment(@Param('id') id: string, @Body() body: DepartmentDto) {
    return await this.departmentService.updateOneDepartment(id, body);
  }

  @Delete(':id')
  async deleteDepartment(@Param('id') id: string) {
    return await this.departmentService.deleteOneDepartment(id);
  }
}
