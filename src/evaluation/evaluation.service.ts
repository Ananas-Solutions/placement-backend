import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseTrainingSite } from 'src/courses/entity/course-training-site.entity';
import { Courses } from 'src/courses/entity/courses.entity';

import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { TrainingSiteEvaluationDto } from './dto/training-site-evaluation.dto';
import { StudentEvaluationDto } from './dto/student-evaluation.dto';
import { SupervisorEvaluationDto } from './dto/supervisor-evaluation.dto';

import { StudentEvaluation } from './entity/student-evaluation.entity';
import { SupervisorEvaluation } from './entity/supervisor-evaluation.entity';
import { TrainingSiteEvaluation } from './entity/training-site-evaluation.entity';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(StudentEvaluation)
    private readonly studentEvaluationRepository: Repository<StudentEvaluation>,
    @InjectRepository(SupervisorEvaluation)
    private readonly supervisorEvaluationRepository: Repository<SupervisorEvaluation>,
    @InjectRepository(TrainingSiteEvaluation)
    private readonly trainingSiteRepository: Repository<TrainingSiteEvaluation>,
  ) {}

  public async evaluateStudent(
    evaluatorId: string,
    body: StudentEvaluationDto,
  ) {
    const { studentId, evaluation, courseId } = body;
    return await this.studentEvaluationRepository.save({
      evaluator: { id: evaluatorId } as User,
      evaluation,
      evalutee: { id: studentId } as User,
      course: { id: courseId } as Courses,
    });
  }

  public async evaluateSupervisor(
    evaluatorId: string,
    body: SupervisorEvaluationDto,
  ) {
    const { supervisorId, courseId, evaluation } = body;
    return await this.supervisorEvaluationRepository.save({
      evaluator: { id: evaluatorId } as User,
      evaluation,
      evalutee: { id: supervisorId } as User,
      course: { id: courseId } as Courses,
    });
  }

  public async evaluateTrainingSite(
    evaluatorId: string,
    body: TrainingSiteEvaluationDto,
  ) {
    const { trainingSiteId, courseId, evaluation } = body;
    return await this.trainingSiteRepository.save({
      evaluator: { id: evaluatorId } as User,
      evaluation,
      trainingSite: { id: trainingSiteId } as CourseTrainingSite,
      course: { id: courseId } as Courses,
    });
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
