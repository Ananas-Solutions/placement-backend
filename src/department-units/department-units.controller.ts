import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DepartmentUnitsService } from './department-units.service';
import {
  DepartmentUnitsDto,
  UpdateDepartmentUnitsDto,
} from './dto/department-units.dto';

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
