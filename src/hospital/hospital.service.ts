import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entity/department.entity';
import { Hospital } from './entity/hospital.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { CreateHospitalDto, UpdateHospitalDto } from './dto/hospital.dto';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async saveHospital(body: CreateHospitalDto): Promise<Hospital> {
    try {
      const newHospital = this.hospitalRepository.create(body);
      return await this.hospitalRepository.save(newHospital);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findAllHospital(): Promise<Hospital[]> {
    try {
      return await this.hospitalRepository.find();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOneHospital(id: string): Promise<Hospital> {
    try {
      return await this.hospitalRepository.findOne(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateOneHospital(body: UpdateHospitalDto): Promise<Hospital> {
    try {
      const hospital = await this.hospitalRepository.findOne(body.id);
      if (!hospital) throw new Error('Hospital not found.');
      return await this.hospitalRepository.save({ ...hospital, ...body });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteOneHospital(id: string): Promise<any> {
    try {
      return await this.hospitalRepository.delete(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async saveDepartment(body: CreateDepartmentDto): Promise<Department> {
    try {
      const hospital = await this.hospitalRepository.findOne(body.hospitalId);
      if (!hospital) {
        throw new Error('Hospital not found for given id. Try again.');
      }
      const newDepartment = await this.departmentRepository.create({
        name: body.name,
        hospital: hospital,
      });
      return await this.departmentRepository.save(newDepartment);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findHospitalDepartments(hospitalId: string): Promise<Department[]> {
    try {
      return await this.departmentRepository.find({
        where: { hospital: hospitalId },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOneDepartment(departmentId: string): Promise<Department> {
    try {
      return await this.departmentRepository.findOne({
        where: { id: departmentId },
        relations: ['hospital'],
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateOneDepartment(body: UpdateDepartmentDto): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOne(body.id);
      if (!department) throw new Error('Department not found.');
      return await this.departmentRepository.save({ ...department, ...body });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteOneDepartment(id: string): Promise<any> {
    try {
      return await this.departmentRepository.delete(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
