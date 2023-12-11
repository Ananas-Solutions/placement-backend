import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserRoleEnum } from 'commons/enums';
import {
  CoordinatorCollegeDepartmentEntity,
  CoordinatorProfileEntity,
  CourseEntity,
  CustomBaseEntity,
  NotificationEntity,
  PlacementEntity,
  StudentCourseEntity,
  StudentEvaluationEntity,
  StudentProfileEntity,
  SupervisorEvaluationEntity,
  SupervisorProfileEntity,
  TrainingSiteEvaluationEntity,
  UserDocumentEntity,
} from './index.entity';

@Entity()
export class UserEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.ADMIN })
  role: UserRoleEnum;

  @Index()
  @Column({ nullable: true, default: '' })
  studentId?: string;

  @Column({ default: false })
  locked: boolean;

  @OneToMany(() => UserDocumentEntity, (userDocument) => userDocument.user, {
    cascade: true,
  })
  documents: UserDocumentEntity[];

  @OneToOne(
    () => StudentProfileEntity,
    (studentProfile) => studentProfile.user,
    {
      cascade: true,
    },
  )
  studentProfile: StudentProfileEntity;

  @OneToOne(
    () => SupervisorProfileEntity,
    (studentProfile) => studentProfile.user,
    {
      cascade: true,
    },
  )
  clinicalSupervisorProfile: SupervisorProfileEntity;

  @OneToOne(
    () => CoordinatorProfileEntity,
    (coodinatorProfile) => coodinatorProfile.user,
    {
      cascade: true,
    },
  )
  coodinatorProfile: CoordinatorProfileEntity;

  @OneToMany(
    () => CoordinatorCollegeDepartmentEntity,
    (coodinatorCollegeDepartment) => coodinatorCollegeDepartment.coordinator,
    {
      cascade: true,
    },
  )
  coodinatorCollegeDepartment: CoordinatorCollegeDepartmentEntity[];

  @OneToMany(() => CourseEntity, (courses) => courses.coordinator, {
    cascade: true,
  })
  courses: CourseEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user, {
    cascade: true,
  })
  notification: NotificationEntity[];

  @OneToMany(() => PlacementEntity, (placement) => placement.student, {
    cascade: true,
  })
  placements: PlacementEntity[];

  @OneToMany(
    () => StudentCourseEntity,
    (studentCourses) => studentCourses.student,
    {
      cascade: true,
    },
  )
  studentCourses: StudentCourseEntity[];

  @OneToMany(
    () => StudentEvaluationEntity,
    (studentEvaluation) => studentEvaluation.evaluator,
    {
      cascade: true,
    },
  )
  studentEvaluator: StudentEvaluationEntity[];

  @OneToMany(
    () => StudentEvaluationEntity,
    (studentEvaluation) => studentEvaluation.evaluatee,
    {
      cascade: true,
    },
  )
  studentEvaluatee: StudentEvaluationEntity[];

  @OneToMany(
    () => SupervisorEvaluationEntity,
    (supervisorEvaluation) => supervisorEvaluation.evaluatee,
    {
      cascade: true,
    },
  )
  supervisorEvaluator: SupervisorEvaluationEntity[];

  @OneToMany(
    () => SupervisorEvaluationEntity,
    (supervisorEvaluation) => supervisorEvaluation.evaluatee,
    {
      cascade: true,
    },
  )
  supervisorEvaluatee: SupervisorEvaluationEntity[];

  @OneToMany(
    () => TrainingSiteEvaluationEntity,
    (trainingSiteEvaluation) => trainingSiteEvaluation.evaluator,
    {
      cascade: true,
    },
  )
  trainingSiteEvaluator: TrainingSiteEvaluationEntity[];
}
