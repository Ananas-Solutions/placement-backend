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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@ApiTags('department')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COORDINATOR)
@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Post()
  async createDepartment(@Body() body: CreateDepartmentDto): Promise<any> {
    return await this.departmentService.saveDepartment(body);
  }

  @Get()
  async getAllDepartment(): Promise<any> {
    return await this.departmentService.findAllHospitals();
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
