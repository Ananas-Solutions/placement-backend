import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  CourseEntity,
  CourseTrainingSiteEntity,
  CustomBaseEntity,
  TrainingTimeSlotEntity,
  UserEntity,
} from './index.entity';

@Entity()
export class TrainingSiteEvaluationEntity extends CustomBaseEntity {
  @Column({ type: 'jsonb' })
  evaluation: any;

  @ManyToOne(() => UserEntity, (user) => user.trainingSiteEvaluator, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  evaluator: UserEntity;

  @ManyToOne(
    () => CourseTrainingSiteEntity,
    (courseTrainingSite) => courseTrainingSite.trainingSiteEvaluation,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  trainingSite: CourseTrainingSiteEntity;

  @ManyToOne(() => CourseEntity, (course) => course.trainingSiteEvaluation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: CourseEntity;

  @ManyToOne(
    () => TrainingTimeSlotEntity,
    (trainingTimeSlot) => trainingTimeSlot.trainingSiteEvaluation,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  timeslot: TrainingTimeSlotEntity;
}
