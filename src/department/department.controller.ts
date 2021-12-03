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
import { NotFoundInterceptor } from 'src/interceptors/error-interceptor';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@ApiTags('department')
@UseInterceptors(NotFoundInterceptor)
@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Post()
  async createDepartment(@Body() body: CreateDepartmentDto): Promise<any> {
    return await this.departmentService.saveDepartment(body);
  }

  @Get('hospital/:hospitalId')
  async queryHospitalDepartment(
    @Param() { hospitalId }: { hospitalId: string },
  ): Promise<any> {
    return await this.departmentService.findHospitalDepartments(hospitalId);
  }

  @Get(':id')
  async queryOneDepartment(@Param() { id }: { id: string }): Promise<any> {
    return await this.departmentService.findOneDepartment(id);
  }

  @Put()
  async updateDepartment(@Body() body: UpdateDepartmentDto): Promise<any> {
    return await this.departmentService.updateOneDepartment(body);
  }

  @Delete(':id')
  async deleteDepartment(@Param() { id }: { id: string }): Promise<any> {
    return await this.departmentService.deleteOneDepartment(id);
  }
}
