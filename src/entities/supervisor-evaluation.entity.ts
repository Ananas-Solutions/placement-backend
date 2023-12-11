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

  @ManyToOne(() => UserEntity, (user) => user.supervisorEvaluator, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  evaluator: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.supervisorEvaluatee, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  evaluatee: UserEntity;

  @ManyToOne(() => CourseEntity, (course) => course.supervisorEvaluation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: CourseEntity;

  @ManyToOne(
    () => TrainingTimeSlotEntity,
    (trainingTimeSlot) => trainingTimeSlot.supervisorEvaluation,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  timeslot: TrainingTimeSlotEntity;
}
