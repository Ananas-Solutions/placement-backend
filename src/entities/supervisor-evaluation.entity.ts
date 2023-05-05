import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  CourseEntity,
  CustomBaseEntity,
  TrainingTimeSlotEntity,
  UserEntity,
} from './index.entity';

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

  @ManyToOne(() => TrainingTimeSlotEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  timeslot: TrainingTimeSlotEntity;
}
