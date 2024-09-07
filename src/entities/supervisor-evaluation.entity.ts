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

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'], eager: false })
  @JoinColumn()
  evaluator: UserEntity;

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'], eager: false })
  @JoinColumn()
  evaluatee: UserEntity;

  @ManyToOne(() => CourseEntity, { cascade: ['soft-remove'], eager: false })
  @JoinColumn()
  course: CourseEntity;

  @ManyToOne(() => TrainingTimeSlotEntity, {
    cascade: ['soft-remove'],
    eager: false,
  })
  @JoinColumn()
  timeslot: TrainingTimeSlotEntity;
}
