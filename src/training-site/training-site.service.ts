import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Authority } from 'src/authority/entity/authority.entity';
import { Courses } from 'src/courses/entity/courses.entity';
import { Department } from 'src/department/entity/department.entity';
import { Hospital } from 'src/hospital/entity/hospital.entity';
import { HospitalService } from 'src/hospital/hospital.service';
import { Repository } from 'typeorm';
import { CreateTrainingSiteDto } from './dto/training-site.dto';
import { TrainingSite } from './entity/training-site.entity';

@Injectable()
export class TrainingSiteService {
  constructor(
    @InjectRepository(TrainingSite)
    private readonly trainingSiteRepository: Repository<TrainingSite>,
    private readonly hospitalService: HospitalService,
  ) {}

  async create(body: CreateTrainingSiteDto): Promise<TrainingSite> {
    try {
      const { hospitalId, departmentId, courseId, ...rest } = body;
      const hospital = await this.hospitalService.findOneHospital(hospitalId);
      return await this.trainingSiteRepository.save({
        ...rest,
        authority: { id: hospital.authority.id } as Authority,
        hospital: { id: hospitalId } as Hospital,
        department: { id: departmentId } as Department,
        course: { id: courseId } as Courses,
      });
    } catch (err) {
      throw err;
    }
  }

  async findAll(): Promise<any> {
    try {
      return await this.trainingSiteRepository.find({
        relations: ['authority', 'hospital', 'department'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      return await this.trainingSiteRepository.findOne(id, {
        relations: ['authority', 'hospital', 'department', 'trainingTimeSlots'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findByHospital(hospitalId: string): Promise<any> {
    try {
      return await this.trainingSiteRepository.findOne({
        where: { hospital: { id: hospitalId } },
        relations: ['authority', 'hospital', 'department', 'trainingTimeSlots'],
      });
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, body: CreateTrainingSiteDto): Promise<any> {
    try {
      const { hospitalId, departmentId, ...rest } = body;
      const hospital = await this.hospitalService.findOneHospital(hospitalId);
      await this.trainingSiteRepository.update(
        { id },
        {
          ...rest,
          authority: { id: hospital.authority.id } as Authority,
          hospital: { id: hospitalId } as Hospital,
          department: { id: departmentId } as Department,
        },
      );
      return await this.trainingSiteRepository.findOne(id);
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await this.trainingSiteRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
