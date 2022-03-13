import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemesterDto, UpdateSemesterDto } from './dto/semester.dto';
import { Semester } from './entity/semester.entity';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
  ) {}

  async save(body: SemesterDto): Promise<Semester> {
    try {
      return await this.semesterRepository.save(body);
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string): Promise<Semester> {
    try {
      return await this.semesterRepository.findOne(id);
    } catch (err) {
      throw err;
    }
  }

  async findAll(): Promise<Semester[]> {
    try {
      return await this.semesterRepository.find();
    } catch (err) {
      throw err;
    }
  }

  async update(bodyDto: UpdateSemesterDto): Promise<any> {
    try {
      const { id, ...body } = bodyDto;
      return await this.semesterRepository.update({ id }, { ...body });
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return this.semesterRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
