import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { StudentEvaluationEntity } from 'entities/student-evaluation.entity';
import { SupervisorEvaluationEntity } from 'entities/supervisor-evaluation.entity';
import { TrainingSiteEvaluationEntity } from 'entities/training-site-evaluation.entity';
import { UserEntity } from 'entities/user.entity';
import { CourseEntity } from 'entities/courses.entity';
import { CourseTrainingSiteEntity } from 'entities/course-training-site.entity';

import {
  StudentEvaluationDto,
  SupervisorEvaluationDto,
  TrainingSiteEvaluationDto,
} from './dto';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(StudentEvaluationEntity)
    private readonly studentEvaluationRepository: Repository<StudentEvaluationEntity>,
    @InjectRepository(SupervisorEvaluationEntity)
    private readonly supervisorEvaluationRepository: Repository<SupervisorEvaluationEntity>,
    @InjectRepository(TrainingSiteEvaluationEntity)
    private readonly trainingSiteRepository: Repository<TrainingSiteEvaluationEntity>,
  ) {}

  public async evaluateStudent(
    evaluatorId: string,
    body: StudentEvaluationDto,
  ): Promise<ISuccessMessageResponse> {
    const { studentId, evaluation, courseId } = body;
    await this.studentEvaluationRepository.save({
      evaluator: { id: evaluatorId } as UserEntity,
      evaluation,
      evalutee: { id: studentId } as UserEntity,
      course: { id: courseId } as CourseEntity,
    });

    return { message: 'Evaluation submitted successfully.' };
  }

  public async evaluateSupervisor(
    evaluatorId: string,
    body: SupervisorEvaluationDto,
  ): Promise<ISuccessMessageResponse> {
    const { supervisorId, courseId, evaluation } = body;
    await this.supervisorEvaluationRepository.save({
      evaluator: { id: evaluatorId } as UserEntity,
      evaluation,
      evalutee: { id: supervisorId } as UserEntity,
      course: { id: courseId } as CourseEntity,
    });

    return { message: 'Evaluation submitted successfully.' };
  }

  public async evaluateTrainingSite(
    evaluatorId: string,
    body: TrainingSiteEvaluationDto,
  ): Promise<ISuccessMessageResponse> {
    const { trainingSiteId, courseId, evaluation } = body;
    await this.trainingSiteRepository.save({
      evaluator: { id: evaluatorId } as UserEntity,
      evaluation,
      trainingSite: { id: trainingSiteId } as CourseTrainingSiteEntity,
      course: { id: courseId } as CourseEntity,
    });

    return { message: 'Evaluation submitted successfully.' };
  }

  public async viewEvaluatedStudents(supervisorId: string, courseId: string) {
    return await this.studentEvaluationRepository.find({
      where: { evaluator: { id: supervisorId }, course: { id: courseId } },
      relations: ['evalutee'],
    });
  }

  public async viewEvaluatedSupervisor(studentId: string, courseId: string) {
    return await this.supervisorEvaluationRepository.find({
      where: { evaluator: { id: studentId }, course: { id: courseId } },
      relations: ['evalutee'],
    });
  }

  public async viewEvaluatedTrainingSites(studentId: string, courseId: string) {
    return await this.trainingSiteRepository.find({
      where: { evaluator: { id: studentId }, course: { id: courseId } },
      relations: ['trainingSite'],
    });
  }

  public async studentViewOwnEvaluation(evaluteeId: string, courseId: string) {
    return await this.studentEvaluationRepository.find({
      where: { evaluatee: { id: evaluteeId }, course: { id: courseId } },
      relations: ['evaluator'],
    });
  }

  public async supervisorViewOwnEvaluation(
    evaluteeId: string,
    courseId: string,
  ) {
    return await this.supervisorEvaluationRepository.find({
      where: { evaluatee: { id: evaluteeId }, course: { id: courseId } },
      //  relations: ['evaluator'],
    });
  }
}
