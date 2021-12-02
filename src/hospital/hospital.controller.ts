import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { CreateHospitalDto, UpdateHospitalDto } from './dto/hospital.dto';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  async createHospital(@Body() body: CreateHospitalDto): Promise<any> {
    return await this.hospitalService.saveHospital(body);
  }

  @Get()
  async queryAllHospital(): Promise<any> {
    return await this.hospitalService.findAllHospital();
  }

  @Get(':id/departments')
  async queryHospitalDepartment(
    @Param() { id: hospitalId }: { id: string },
  ): Promise<any> {
    return await this.hospitalService.findHospitalDepartments(hospitalId);
  }

  @Get(':id')
  async queryOneHospital(@Param() { id }: { id: string }): Promise<any> {
    return await this.hospitalService.findOneHospital(id);
  }

  @Put()
  async updateHospital(@Body() body: UpdateHospitalDto): Promise<any> {
    return await this.hospitalService.updateOneHospital(body);
  }

  @Delete(':id')
  async deleteHospital(@Param() { id }: { id: string }): Promise<any> {
    return await this.hospitalService.deleteOneHospital(id);
  }

  @Post('department')
  async createDepartment(@Body() body: CreateDepartmentDto): Promise<any> {
    return await this.hospitalService.saveDepartment(body);
  }

  @Get('department/:id')
  async queryOneDepartment(@Param() { id }: { id: string }): Promise<any> {
    return await this.hospitalService.findOneDepartment(id);
  }

  @Put('department')
  async updateDepartment(@Body() body: UpdateDepartmentDto): Promise<any> {
    return await this.hospitalService.updateOneDepartment(body);
  }

  @Delete('department/:id')
  async deleteDepartment(@Param() { id }: { id: string }): Promise<any> {
    return await this.hospitalService.deleteOneDepartment(id);
  }
}
