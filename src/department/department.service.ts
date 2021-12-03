import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HospitalService } from 'src/hospital/hospital.service';
import { Repository } from 'typeorm';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { Department } from './entity/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    private hospitalService: HospitalService,
  ) {}
  async saveDepartment(body: CreateDepartmentDto): Promise<Department> {
    try {
      const hospital = await this.hospitalService.findOneHospital(
        body.hospital,
      );
      if (!hospital) {
        throw new Error('Hospital not found for given id. Try again.');
      }
      const newDepartment = this.departmentRepository.create({
        ...body,
        hospital,
      });
      const department = await this.departmentRepository.save(newDepartment);
      delete department.hospital;
      return department;
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

  async updateOneDepartment(body: UpdateDepartmentDto): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOne(body.id);
      if (!department) throw new NotFoundException('Department not found.');
      const hospital = await this.hospitalService.findOneHospital(
        body.hospital,
      );
      if (!hospital) throw new NotFoundException('Hospital not found');
      const updatedDepartment = await this.departmentRepository.save({
        ...department,
        ...body,
        hospital,
      });
      delete updatedDepartment.hospital.department;
      return updatedDepartment;
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
