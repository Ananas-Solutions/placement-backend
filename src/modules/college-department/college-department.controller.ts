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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';
import { SearchQueryDto } from 'commons/dto';
import { ErrorInterceptor } from 'interceptor/error.interceptor';
import { TransformResponseInterceptor } from 'interceptor/transform-response.interceptor';

import { CollegeDepartmentService } from './college-department.service';
import { CollegeDepartmentDto } from './dto';
import { SuccessMessageResponse } from 'commons/response';
import { CollegeDepartmentResponse } from './response';

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
  @ApiOperation({ summary: 'Create a new college department' })
  @ApiResponse({
    status: 201,
    description: 'The college department has been successfully created.',
    type: CollegeDepartmentDto,
  })
  @UseInterceptors(new TransformResponseInterceptor(CollegeDepartmentResponse))
  async createDepartment(@Body() body: CollegeDepartmentDto) {
    return this.collegeDepartmentService.save(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all college departments' })
  @ApiResponse({
    status: 200,
    description: 'The college departments have been successfully fetched.',
    type: [CollegeDepartmentDto],
  })
  @UseInterceptors(new TransformResponseInterceptor(CollegeDepartmentResponse))
  async findAllDepartment(@Query() query: SearchQueryDto) {
    return this.collegeDepartmentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a college department by id' })
  @ApiResponse({
    status: 200,
    description: 'The college department has been successfully fetched.',
    type: CollegeDepartmentDto,
  })
  @UseInterceptors(new TransformResponseInterceptor(CollegeDepartmentResponse))
  async findOneDepartment(@Param('id') id: string) {
    return this.collegeDepartmentService.findOne(id);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update a college department by id' })
  @ApiResponse({
    status: 200,
    description: 'The college department has been successfully updated.',
    type: CollegeDepartmentDto,
  })
  @UseInterceptors(new TransformResponseInterceptor(CollegeDepartmentResponse))
  async updateDepartment(
    @Param('id') id: string,
    @Body() body: CollegeDepartmentDto,
  ) {
    return this.collegeDepartmentService.update(id, body);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a college department by id' })
  @ApiResponse({
    status: 200,
    description: 'The college department has been successfully deleted.',
    type: SuccessMessageResponse,
  })
  @UseInterceptors(new TransformResponseInterceptor(SuccessMessageResponse))
  async deleteDepartment(@Param('id') id: string) {
    return this.collegeDepartmentService.delete(id);
  }
}
