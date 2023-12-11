import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';

import {
  CollegeDepartmentEntity,
  CourseTrainingSiteEntity,
  CustomBaseEntity,
  SemesterEntity,
  StudentCourseEntity,
  StudentEvaluationEntity,
  SupervisorEvaluationEntity,
  TrainingSiteEvaluationEntity,
  UserEntity,
} from './index.entity';

@Entity()
@Unique('unique_course', ['name', 'department', 'semester'])
export class CourseEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'date', default: new Date() })
  startsFrom: Date;

  @Column({ type: 'date', default: new Date() })
  endsAt: Date;

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;

  @ManyToOne(() => UserEntity, (user) => user.courses, { onDelete: 'CASCADE' })
  @JoinColumn()
  coordinator: UserEntity;

  @ManyToOne(
    () => CollegeDepartmentEntity,
    (department) => department.courses,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  department: CollegeDepartmentEntity;

  @ManyToOne(() => SemesterEntity, (semester) => semester.course, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  semester: SemesterEntity;

  @OneToMany(() => CourseTrainingSiteEntity, (ts) => ts.course, {
    cascade: true,
  })
  trainingSite: CourseTrainingSiteEntity[];

  @OneToMany(() => StudentCourseEntity, (students) => students.course, {
    cascade: true,
  })
  student: StudentCourseEntity[];

  @OneToMany(
    () => StudentEvaluationEntity,
    (studentEvaluation) => studentEvaluation.course,
    {
      cascade: true,
    },
  )
  studentEvaluation: StudentEvaluationEntity[];

  @OneToMany(
    () => SupervisorEvaluationEntity,
    (supervisorEvaluation) => supervisorEvaluation.course,
    {
      cascade: true,
    },
  )
  supervisorEvaluation: SupervisorEvaluationEntity[];

  @OneToMany(
    () => TrainingSiteEvaluationEntity,
    (trainingSiteEvaluation) => trainingSiteEvaluation.course,
    {
      cascade: true,
    },
  )
  trainingSiteEvaluations: TrainingSiteEvaluationEntity[];
}
