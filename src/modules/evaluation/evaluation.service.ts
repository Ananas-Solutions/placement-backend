import { Injectable } from '@nestjs/common';

import { ISuccessMessageResponse } from 'commons/response';
import {
  CourseEntity,
  CourseTrainingSiteEntity,
  TrainingTimeSlotEntity,
  UserEntity,
} from 'entities/index.entity';
import {
  StudentEvaluationRepositoryService,
  SupervisorEvaluationRepositoryService,
  TrainingSiteEvaluationRepositoryService,
} from 'repository/services';

import {
  StudentEvaluationDto,
  SupervisorEvaluationDto,
  TrainingSiteEvaluationDto,
} from './dto';

@Injectable()
export class EvaluationService {
  constructor(
    private readonly studentEvaluationRepository: StudentEvaluationRepositoryService,
    private readonly supervisorEvaluationRepository: SupervisorEvaluationRepositoryService,
    private readonly trainingSiteRepository: TrainingSiteEvaluationRepositoryService,
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
    return await this.studentEvaluationRepository.findMany(
      {
        course: { id: courseId },
      },
      { evaluatee: true, evaluator: true },
    );
  }

  public async viewEvaluatedStudentById(evaluationId: string) {
    return await this.studentEvaluationRepository.findMany(
      {
        id: evaluationId,
      },
      { evaluatee: true, evaluator: true },
    );
  }

  public async viewEvaluatedSupervisor(studentId: string, courseId: string) {
    return await this.supervisorEvaluationRepository.findMany(
      {
        course: { id: courseId },
      },
      { evaluatee: true, evaluator: true, timeslot: true },
    );
  }

  public async viewEvaluatedSupervisorById(evaluationId: string) {
    return await this.supervisorEvaluationRepository.findMany(
      {
        id: evaluationId,
      },
      { evaluatee: true, evaluator: true, timeslot: true },
    );
  }

  public async viewEvaluatedTrainingSites(courseId: string) {
    const allTrainingSiteEvaluation =
      await this.trainingSiteRepository.findMany(
        {
          course: { id: courseId },
        },
        { trainingSite: true, timeslot: true },
      );

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
    const allTrainingSiteEvaluations =
      await this.trainingSiteRepository.findMany(
        {
          course: { id: courseId },
          trainingSite: { id: trainingSiteId },
        },
        {
          trainingSite: { departmentUnit: true },
          evaluator: true,
          timeslot: true,
        },
      );

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
    const singleEvaluation = await this.trainingSiteRepository.findOne(
      {
        id: evaluationId,
      },
      { trainingSite: { departmentUnit: true }, evaluator: true },
    );

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
    return await this.studentEvaluationRepository.findMany(
      {
        evaluatee: { id: evaluteeId },
        course: { id: courseId },
      },
      { evaluator: true },
    );
  }

  public async supervisorViewOwnEvaluation(
    evaluteeId: string,
    courseId: string,
  ) {
    return await this.supervisorEvaluationRepository.findMany({
      evaluatee: { id: evaluteeId },
      course: { id: courseId },
    });
  }
}
