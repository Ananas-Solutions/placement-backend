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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { DepartmentUnitsService } from './department-units.service';
import {
  DepartmentUnitsDto,
  UpdateDepartmentUnitsDto,
} from './dto/department-units.dto';

@ApiTags('hospital department units')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.ADMIN)
@Controller('department-unit')
export class DepartmentUnitsController {
  constructor(
    private readonly departmentUnitsService: DepartmentUnitsService,
  ) {}

  @Post()
  async saveUnit(@Body() body: DepartmentUnitsDto): Promise<any> {
    const newUnit = await this.departmentUnitsService.save(body);
    delete newUnit.department.hospital;
    return newUnit;
  }

  @Get()
  async getAllUnits(): Promise<any> {
    return await this.departmentUnitsService.findAll();
  }

  @Get('department/:departmentId')
  async findAllUnit(
    @Param() { departmentId }: { departmentId: string },
  ): Promise<any> {
    return await this.departmentUnitsService.find(departmentId);
  }

  @Get(':id')
  async findOneUnit(@Param() { id }: { id: string }): Promise<any> {
    return await this.departmentUnitsService.findOne(id);
  }

  @Put()
  async updateUnit(@Body() body: UpdateDepartmentUnitsDto): Promise<any> {
    return this.departmentUnitsService.update(body);
  }

  @Delete(':id')
  async deletUnit(@Param() { id }: { id: string }): Promise<any> {
    return this.departmentUnitsService.delete(id);
  }
}
