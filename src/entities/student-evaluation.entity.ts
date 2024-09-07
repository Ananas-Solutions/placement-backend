import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CourseEntity, CustomBaseEntity, UserEntity } from './index.entity';

@Entity()
export class StudentEvaluationEntity extends CustomBaseEntity {
  @Column({ type: 'jsonb' })
  evaluation: any;

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'], eager: false })
  @JoinColumn()
  evaluator: UserEntity;

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'], eager: false })
  @JoinColumn()
  evaluatee: UserEntity;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE', eager: false })
  @JoinColumn()
  course: CourseEntity;
}
