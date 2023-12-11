import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CourseEntity, CustomBaseEntity, UserEntity } from './index.entity';

@Entity()
export class StudentEvaluationEntity extends CustomBaseEntity {
  @Column({ type: 'jsonb' })
  evaluation: any;

  @ManyToOne(() => UserEntity, (user) => user.studentEvaluator, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  evaluator: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.studentEvaluatee, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  evaluatee: UserEntity;

  @ManyToOne(() => CourseEntity, (course) => course.studentEvaluation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: CourseEntity;
}
