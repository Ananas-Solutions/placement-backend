import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from 'src/hospital/entity/hospital.entity';
import { HospitalService } from 'src/hospital/hospital.service';
import { Repository } from 'typeorm';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { Department } from './entity/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}
  async saveDepartment(bodyDto: CreateDepartmentDto): Promise<Department> {
    try {
      const { hospitalId, ...body } = bodyDto;
      const newDepartment = this.departmentRepository.create({
        ...body,
        hospital: { id: hospitalId } as Hospital,
      });
      const department = await this.departmentRepository.save(newDepartment);
      delete department.hospital;
      return department;
    } catch (err) {
      throw err;
    }
  }

  async findAllHospitals(): Promise<Department[]> {
    try {
      return await this.departmentRepository.find();
    } catch (err) {
      throw err;
    }
  }

  async findHospitalDepartments(hospitalId: string): Promise<Department[]> {
    try {
      return await this.departmentRepository.find({
        where: { hospital: hospitalId },
      });
    } catch (err) {
      throw err;
    }
  }

  async findOneDepartment(departmentId: string): Promise<Department> {
    try {
      return await this.departmentRepository.findOne({
        where: { id: departmentId },
        relations: ['hospital'],
      });
    } catch (err) {
      throw err;
    }
  }

  async updateOneDepartment(bodyDto: UpdateDepartmentDto): Promise<any> {
    try {
      const { hospitalId, ...body } = bodyDto;
      return await this.departmentRepository.update(
        { id: bodyDto.id },
        {
          ...body,
          hospital: { id: hospitalId } as Hospital,
        },
      );
    } catch (err) {
      throw err;
    }
  }

  async deleteOneDepartment(id: string): Promise<any> {
    try {
      return await this.departmentRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
