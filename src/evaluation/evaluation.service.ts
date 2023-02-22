import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from 'src/courses/entity/courses.entity';
import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { DepartmentUnitEvaluationDto } from './dto/department-unit-evaluation.dto';
import { StudentEvaluationDto } from './dto/student-evaluation.dto';
import { SupervisorEvaluationDto } from './dto/supervisor-evaluation.dto';

import { DepartmentUnitEvaluation } from './entity/department-unit-evaluation.entity';
import { StudentEvaluation } from './entity/student-evaluation.entity';
import { SupervisorEvaluation } from './entity/supervisor-evaluation.entity';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(StudentEvaluation)
    private readonly studentEvaluationRepository: Repository<StudentEvaluation>,
    @InjectRepository(SupervisorEvaluation)
    private readonly supervisorEvaluationRepository: Repository<SupervisorEvaluation>,
    @InjectRepository(DepartmentUnitEvaluation)
    private readonly departmentUnitRepository: Repository<DepartmentUnitEvaluation>,
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

  public async evaluateDepartmentUnit(
    evaluatorId: string,
    body: DepartmentUnitEvaluationDto,
  ) {
    const { departmentUnitId, courseId, evaluation } = body;
    return await this.departmentUnitRepository.save({
      evaluator: { id: evaluatorId } as User,
      evaluation,
      departmentUnit: { id: departmentUnitId } as DepartmentUnits,
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

  public async viewEvaluatedDepartmentUnits(
    studentId: string,
    courseId: string,
  ) {
    return await this.departmentUnitRepository.find({
      where: { evaluator: { id: studentId }, course: { id: courseId } },
      relations: ['departmentUnit'],
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
      relations: ['evaluator'],
    });
  }
}
