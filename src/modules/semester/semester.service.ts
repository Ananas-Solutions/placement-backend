import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SearchQueryDto } from 'commons/dto';
import { ISuccessMessageResponse } from 'commons/response';
import { SemesterEntity } from 'entities/semester.entity';

import { SemesterDto } from './dto';
import { ISemesterResponse } from './response';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(SemesterEntity)
    private readonly semesterRepository: Repository<SemesterEntity>,
  ) {}

  async save(body: SemesterDto): Promise<ISemesterResponse> {
    const newSemester = await this.semesterRepository.save(body);
    return this.transformToResponse(newSemester);
  }

  async findOne(semesterId: string): Promise<ISemesterResponse> {
    const semester = await this.semesterRepository.findOne({
      where: { id: semesterId },
      loadEagerRelations: false,
    });
    return this.transformToResponse(semester);
  }

  async findAll(query: SearchQueryDto): Promise<ISemesterResponse[]> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const allSemesters = await this.semesterRepository.find({
      loadEagerRelations: false,
      skip,
      take: limit,
    });

    return allSemesters.map((semester) => this.transformToResponse(semester));
  }

  async update(
    semesterId: string,
    bodyDto: SemesterDto,
  ): Promise<ISemesterResponse> {
    const { startYear, endYear, semester } = bodyDto;
    await this.semesterRepository.update(
      { id: semesterId },
      { startYear, endYear, semester },
    );

    const updatedSemester = await this.semesterRepository.findOne({
      where: { id: semesterId },
      loadEagerRelations: false,
    });

    return this.transformToResponse(updatedSemester);
  }

  async delete(semesterId: string): Promise<ISuccessMessageResponse> {
    const semester = await this.semesterRepository.findOne({
      where: { id: semesterId },
    });
    await this.semesterRepository.softRemove(semester);

    return { message: 'Semester deleted successfully' };
  }

  private transformToResponse(entity: SemesterEntity): ISemesterResponse {
    const { id, semester, startYear, endYear } = entity;

    return {
      id,
      semester,
      startYear,
      endYear,
    };
  }
}
