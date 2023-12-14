import { Injectable } from '@nestjs/common';

import { ISuccessMessageResponse } from 'commons/response';
import { SemesterEntity } from 'entities/semester.entity';
import { SemesterRepositoryService } from 'repository/services';

import { SemesterDto } from './dto';
import { ISemesterResponse } from './response';

@Injectable()
export class SemesterService {
  constructor(private readonly semesterRepository: SemesterRepositoryService) {}

  async save(body: SemesterDto): Promise<ISemesterResponse> {
    const newSemester = await this.semesterRepository.save(body);
    return this.transformToResponse(newSemester);
  }

  async findOne(semesterId: string): Promise<ISemesterResponse> {
    const semester = await this.semesterRepository.findOne({
      id: semesterId,
    });
    return this.transformToResponse(semester);
  }

  async findAll(): Promise<ISemesterResponse[]> {
    const allSemesters = await this.semesterRepository.findMany();
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
      id: semesterId,
    });

    return this.transformToResponse(updatedSemester);
  }

  async delete(semesterId: string): Promise<ISuccessMessageResponse> {
    await this.semesterRepository.delete({
      id: semesterId,
    });

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
