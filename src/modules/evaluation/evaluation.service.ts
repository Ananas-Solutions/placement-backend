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
import { TrainingTimeSlotEntity } from 'entities/training-time-slot.entity';

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
      evaluatee: { id: studentId } as UserEntity,
      course: { id: courseId } as CourseEntity,
    });

    return { message: 'Evaluation submitted successfully.' };
  }

  public async evaluateSupervisor(
    evaluatorId: string,
    body: SupervisorEvaluationDto,
  ): Promise<ISuccessMessageResponse> {
    const { supervisorId, courseId, timeslotId, evaluation } = body;
    await this.supervisorEvaluationRepository.save({
      evaluator: { id: evaluatorId } as UserEntity,
      evaluation,
      evaluatee: { id: supervisorId } as UserEntity,
      course: { id: courseId } as CourseEntity,
      timeslot: { id: timeslotId } as TrainingTimeSlotEntity,
    });

    return { message: 'Evaluation submitted successfully.' };
  }

  public async evaluateTrainingSite(
    evaluatorId: string,
    body: TrainingSiteEvaluationDto,
  ): Promise<ISuccessMessageResponse> {
    const { trainingSiteId, courseId, evaluation, timeslotId } = body;
    await this.trainingSiteRepository.save({
      evaluator: { id: evaluatorId } as UserEntity,
      evaluation,
      trainingSite: { id: trainingSiteId } as CourseTrainingSiteEntity,
      course: { id: courseId } as CourseEntity,
      timeslot: { id: timeslotId } as TrainingTimeSlotEntity,
    });

    return { message: 'Evaluation submitted successfully.' };
  }

  public async viewEvaluatedStudents(supervisorId: string, courseId: string) {
    return await this.studentEvaluationRepository.find({
      where: { course: { id: courseId } },
      loadEagerRelations: false,
      relations: ['evaluatee', 'evaluator'],
    });
  }

  public async viewEvaluatedStudentById(evaluationId: string) {
    return await this.studentEvaluationRepository.find({
      where: { id: evaluationId },
      loadEagerRelations: false,
      relations: ['evaluatee', 'evaluator'],
    });
  }

  public async viewEvaluatedSupervisor(studentId: string, courseId: string) {
    return await this.supervisorEvaluationRepository.find({
      where: { course: { id: courseId } },
      loadEagerRelations: false,
      relations: ['evaluatee', 'evaluator', 'timeslot'],
    });
  }

  public async viewEvaluatedSupervisorById(evaluationId: string) {
    return await this.supervisorEvaluationRepository.find({
      where: { id: evaluationId },
      loadEagerRelations: false,
      relations: ['evaluatee', 'evaluator', 'timeslot'],
    });
  }

  public async viewEvaluatedTrainingSites(courseId: string) {
    const allTrainingSiteEvaluation = await this.trainingSiteRepository.find({
      where: { course: { id: courseId } },
      loadEagerRelations: false,
      relations: ['trainingSite', 'timeslot'],
    });

    const evaluationResult = {};

    allTrainingSiteEvaluation.forEach((evaluation) => {
      const {
        trainingSite: { id },
      } = evaluation;
      if (evaluationResult[id]) {
        const temp = evaluationResult[id];
        evaluationResult[id] = temp + 1;
      } else {
        evaluationResult[id] = 1;
      }
    });

    return evaluationResult;
  }

  public async viewEvaluatedTrainingSitesByTrainingSiteId(
    courseId: string,
    trainingSiteId: string,
  ) {
    const allTrainingSiteEvaluations = await this.trainingSiteRepository.find({
      where: { course: { id: courseId }, trainingSite: { id: trainingSiteId } },
      loadEagerRelations: false,
      relations: [
        'trainingSite',
        'trainingSite.departmentUnit',
        'evaluator',
        'timeslot',
      ],
    });

    const mappedTrainingSiteEvaluations = allTrainingSiteEvaluations.map(
      (evaluation) => {
        const { trainingSite, ...rest } = evaluation;
        const { departmentUnit } = trainingSite;

        return {
          ...rest,
          trainingSite: {
            id: trainingSite.id,
            name: departmentUnit.name,
          },
        };
      },
    );

    return mappedTrainingSiteEvaluations;
  }

  public async viewEvaluatedTrainingSiteById(evaluationId: string) {
    const singleEvaluation = await this.trainingSiteRepository.findOne({
      where: { id: evaluationId },
      loadEagerRelations: false,
      relations: ['trainingSite', 'trainingSite.departmentUnit', 'evaluator'],
    });

    const { trainingSite, ...rest } = singleEvaluation;
    const { departmentUnit } = trainingSite;

    return {
      ...rest,
      trainingSite: {
        id: trainingSite.id,
        name: departmentUnit.name,
      },
    };
  }

  public async studentViewOwnEvaluation(evaluteeId: string, courseId: string) {
    return await this.studentEvaluationRepository.find({
      where: { evaluatee: { id: evaluteeId }, course: { id: courseId } },
      loadEagerRelations: false,
      relations: ['evaluator'],
    });
  }

  public async supervisorViewOwnEvaluation(
    evaluteeId: string,
    courseId: string,
  ) {
    return await this.supervisorEvaluationRepository.find({
      where: { evaluatee: { id: evaluteeId }, course: { id: courseId } },
      loadEagerRelations: false,
      //  relations: ['evaluator'],
    });
  }
}
