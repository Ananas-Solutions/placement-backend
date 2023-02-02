import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentService } from 'src/department/department.service';
import { Department } from 'src/department/entity/department.entity';
import { Hospital } from 'src/hospital/entity/hospital.entity';
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
  ) {}

  async save(bodyDto: DepartmentUnitsDto): Promise<DepartmentUnits> {
    try {
      const { departmentId, hospitalId, ...body } = bodyDto;
      return await this.departmentUnitsRepository.save({
        ...body,
        department: { id: departmentId } as Department,
        hospital: { id: hospitalId } as Hospital,
      });
    } catch (err) {
      throw err;
    }
  }

  async findAll(): Promise<DepartmentUnits[]> {
    try {
      return await this.departmentUnitsRepository.find({
        relations: ['department', 'hospital'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string): Promise<DepartmentUnits> {
    try {
      return await this.departmentUnitsRepository.findOne(id, {
        relations: ['department', 'hospital'],
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

  async update(bodyDto: UpdateDepartmentUnitsDto): Promise<any> {
    try {
      const { departmentId, hospitalId, ...body } = bodyDto;
      return await this.departmentUnitsRepository.update(
        { id: bodyDto.id },
        {
          ...body,
          department: { id: departmentId } as Department,
          hospital: { id: hospitalId } as Hospital,
        },
      );
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
