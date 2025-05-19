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
import { SearchQueryDto } from 'commons/dto';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import { CollegeDepartmentService } from './college-department.service';
import { CollegeDepartmentDto } from './dto';

@ApiTags('college department')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('college-department')
export class CollegeDepartmentController {
  constructor(
    private readonly collegeDepartmentService: CollegeDepartmentService,
  ) {}

  @Roles(UserRoleEnum.ADMIN)
  @Post()
  async createDepartment(@Body() body: CollegeDepartmentDto) {
    return this.collegeDepartmentService.save(body);
  }

  @Get()
  async findAllDepartment(@Query() query: SearchQueryDto) {
    return this.collegeDepartmentService.findAll(query);
  }

  @Get(':id')
  async findOneDepartment(@Param('id') id: string) {
    return this.collegeDepartmentService.findOne(id);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Put(':id')
  async updateDepartment(
    @Param('id') id: string,
    @Body() body: CollegeDepartmentDto,
  ) {
    return this.collegeDepartmentService.update(id, body);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  async deleteDepartment(@Param('id') id: string) {
    return this.collegeDepartmentService.delete(id);
  }
}
