import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  CourseTrainingSiteEntity,
  CustomBaseEntity,
  TrainingTimeSlotEntity,
  UserEntity,
} from './index.entity';

@Entity()
export class PlacementEntity extends CustomBaseEntity {
  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  student: UserEntity;

  @ManyToOne(
    () => CourseTrainingSiteEntity,
    (trainingSite) => trainingSite.placement,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  trainingSite: CourseTrainingSiteEntity;

  @ManyToOne(
    () => TrainingTimeSlotEntity,
    (timeslot) => timeslot.trainingSite,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  timeSlot: TrainingTimeSlotEntity;
}
