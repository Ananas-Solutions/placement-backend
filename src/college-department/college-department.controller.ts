import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { CollegeDepartmentService } from './college-department.service';
import {
  CollegeDepartmentDto,
  UpdateCollegeDepartmentDto,
} from './dto/college-department.dto';

@ApiTags('college department')
@UseInterceptors(ErrorInterceptor)
@Controller('college-department')
export class CollegeDepartmentController {
  constructor(
    private readonly collegeDepartmentService: CollegeDepartmentService,
  ) {}

  @Post()
  async createDepartment(@Body() body: CollegeDepartmentDto): Promise<any> {
    return this.collegeDepartmentService.save(body);
  }

  @Get()
  async findAllDepartment(): Promise<any> {
    return this.collegeDepartmentService.findAll();
  }

  @Get(':id')
  async findOneDepartment(@Param() { id }: { id: string }): Promise<any> {
    return this.collegeDepartmentService.findOne(id);
  }

  @Put()
  async updateDepartment(
    @Body() body: UpdateCollegeDepartmentDto,
  ): Promise<any> {
    return this.collegeDepartmentService.update(body);
  }

  @Delete(':id')
  async deleteDepartment(@Param() { id }: { id: string }): Promise<any> {
    return this.collegeDepartmentService.delete(id);
  }
}
