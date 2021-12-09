import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async update(body: UpdateCollegeDepartmentDto): Promise<CollegeDepartent> {
    try {
      const collegeDepartment = await this.collegeDepartmentRepository.findOne(
        body.id,
      );
      if (!collegeDepartment)
        throw new NotFoundException('Department not found');
      return await this.collegeDepartmentRepository.save({
        ...collegeDepartment,
        ...body,
      });
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
