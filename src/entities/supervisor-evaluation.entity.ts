import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseEntity } from './courses.entity';
import { UserEntity } from './user.entity';

@Entity()
export class SupervisorEvaluationEntity extends CustomBaseEntity {
  @Column({ type: 'jsonb' })
  evaluation: any;

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  evaluator: UserEntity;

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  evaluatee: UserEntity;

  @ManyToOne(() => CourseEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  course: CourseEntity;
}
