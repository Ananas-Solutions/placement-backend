import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import {
  CollegeDepartmentDto,
  UpdateCollegeDepartmentDto,
} from './dto/college-department.dto';
import { CollegeDepartent } from './entity/college-department.entity';

@Injectable()
export class CollegeDepartmentService {
  constructor(
    @InjectRepository(CollegeDepartent)
    private readonly collegeDepartmentRepository: Repository<CollegeDepartent>,
  ) {}

  async save(body: CollegeDepartmentDto): Promise<CollegeDepartent> {
    try {
      const department = await this.collegeDepartmentRepository.findOne({
        name: body.name,
      });
      if (department) throw new ConflictException('Department already exists');
      return await this.collegeDepartmentRepository.save(body);
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string): Promise<CollegeDepartent> {
    try {
      return await this.collegeDepartmentRepository.findOne(id);
    } catch (err) {
      throw err;
    }
  }

  async findAll(): Promise<CollegeDepartent[]> {
    try {
      return await this.collegeDepartmentRepository.find();
    } catch (err) {
      throw err;
    }
  }

  async update(bodyDto: UpdateCollegeDepartmentDto): Promise<UpdateResult> {
    try {
      const { id, ...body } = bodyDto;
      return await this.collegeDepartmentRepository.update(
        { id },
        {
          ...body,
        },
      );
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await this.collegeDepartmentRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
