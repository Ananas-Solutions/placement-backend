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

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'], eager: false })
  @JoinColumn()
  evaluator: UserEntity;

  @ManyToOne(() => CourseTrainingSiteEntity, {
    cascade: ['soft-remove'],
    eager: false,
  })
  @JoinColumn()
  trainingSite: CourseTrainingSiteEntity;

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
