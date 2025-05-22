import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SearchQueryDto } from 'commons/dto';
import { SemesterEntity } from 'entities/semester.entity';
import { DataResponse } from 'commons/response';

import { SemesterDto } from './dto';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(SemesterEntity)
    private readonly semesterRepository: Repository<SemesterEntity>,
  ) {}

  async save(body: SemesterDto): Promise<DataResponse<SemesterEntity>> {
    const newSemester = await this.semesterRepository.save(body);
    return {
      message: 'Semester created successfully',
      data: newSemester,
    };
  }

  async findOne(semesterId: string): Promise<DataResponse<SemesterEntity>> {
    const semester = await this.semesterRepository.findOne({
      where: { id: semesterId },
      loadEagerRelations: false,
    });
    return {
      data: semester,
    };
  }

  async findAll(
    query: SearchQueryDto,
  ): Promise<DataResponse<SemesterEntity[]>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [allSemesters, totalItems] =
      await this.semesterRepository.findAndCount({
        loadEagerRelations: false,
        skip,
        take: limit,
      });

    return {
      data: allSemesters,
      metadata: {
        totalItems,
        page,
        limit,
      },
    };
  }

  async update(
    semesterId: string,
    bodyDto: SemesterDto,
  ): Promise<DataResponse<SemesterEntity>> {
    const { startYear, endYear, semester } = bodyDto;
    await this.semesterRepository.update(
      { id: semesterId },
      { startYear, endYear, semester },
    );

    const updatedSemester = await this.semesterRepository.findOne({
      where: { id: semesterId },
      loadEagerRelations: false,
    });

    return {
      message: 'Semester updated successfully',
      data: updatedSemester,
    };
  }

  async delete(semesterId: string): Promise<DataResponse<SemesterEntity>> {
    const semester = await this.semesterRepository.findOne({
      where: { id: semesterId },
    });
    await this.semesterRepository.softRemove(semester);

    return { message: 'Semester deleted successfully' };
  }
}
