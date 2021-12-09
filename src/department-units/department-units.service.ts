import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentService } from 'src/department/department.service';
import { Repository } from 'typeorm';
import {
  DepartmentUnitsDto,
  UpdateDepartmentUnitsDto,
} from './dto/department-units.dto';
import { DepartmentUnits } from './entity/department-units.entity';

@Injectable()
export class DepartmentUnitsService {
  constructor(
    @InjectRepository(DepartmentUnits)
    private readonly departmentUnitsRepository: Repository<DepartmentUnits>,
    private readonly departmentService: DepartmentService,
  ) {}

  async save(body: DepartmentUnitsDto): Promise<DepartmentUnits> {
    try {
      const department = await this.departmentService.findOneDepartment(
        body.department,
      );
      if (!department) throw new NotFoundException('Department not found');
      return await this.departmentUnitsRepository.save({ ...body, department });
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string): Promise<DepartmentUnits> {
    try {
      return await this.departmentUnitsRepository.findOne(id, {
        relations: ['department'],
      });
    } catch (err) {
      throw err;
    }
  }

  async find(departmentId: string): Promise<DepartmentUnits[]> {
    try {
      return await this.departmentUnitsRepository.find({
        where: { department: departmentId },
      });
    } catch (err) {
      throw err;
    }
  }

  async update(body: UpdateDepartmentUnitsDto): Promise<DepartmentUnits> {
    try {
      const departmentUnits = await this.departmentUnitsRepository.findOne(
        body.id,
      );
      if (!departmentUnits) throw new NotFoundException('Unit not found');
      const department = await this.departmentService.findOneDepartment(
        body.department,
      );
      if (!department) throw new NotFoundException('Department not found');
      const updatedUnit = await this.departmentUnitsRepository.save({
        ...body,
        department,
      });
      delete updatedUnit.department.hospital;
      return updatedUnit;
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await this.departmentUnitsRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
