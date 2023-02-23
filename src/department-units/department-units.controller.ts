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
@Controller('department-unit')
export class DepartmentUnitsController {
  constructor(
    private readonly departmentUnitsService: DepartmentUnitsService,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  async saveUnit(@Body() body: DepartmentUnitsDto): Promise<any> {
    const newUnit = await this.departmentUnitsService.save(body);
    delete newUnit.department.hospital;
    return newUnit;
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Get()
  async getAllUnits(): Promise<any> {
    return await this.departmentUnitsService.findAll();
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Get('department/:departmentId')
  async findAllUnit(
    @Param() { departmentId }: { departmentId: string },
  ): Promise<any> {
    return await this.departmentUnitsService.find(departmentId);
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Get(':id')
  async findOneUnit(@Param() { id }: { id: string }): Promise<any> {
    return await this.departmentUnitsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Put()
  async updateUnit(@Body() body: UpdateDepartmentUnitsDto): Promise<any> {
    return this.departmentUnitsService.update(body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deletUnit(@Param() { id }: { id: string }): Promise<any> {
    return this.departmentUnitsService.delete(id);
  }
}
