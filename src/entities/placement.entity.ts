import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  CourseTrainingSiteEntity,
  CustomBaseEntity,
  TrainingTimeSlotEntity,
  UserEntity,
} from './index.entity';
import { CourseBlockTrainingSiteEntity } from './block-training-site.entity';
import { BlockTrainingTimeSlotEntity } from './block-training-time-slot.entity';

@Entity()
export class PlacementEntity extends CustomBaseEntity {
  @Column({ type: 'boolean', default: true })
  isPublished!: boolean;

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  student: UserEntity;

  @ManyToOne(
    () => CourseTrainingSiteEntity,
    (trainingSite) => trainingSite.placement,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn()
  trainingSite: CourseTrainingSiteEntity;

  @ManyToOne(
    () => TrainingTimeSlotEntity,
    (timeslot) => timeslot.trainingSite,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn()
  timeSlot: TrainingTimeSlotEntity;

  @ManyToOne(
    () => CourseBlockTrainingSiteEntity,
    (blockTrainingSite) => blockTrainingSite.placement,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn()
  blockTrainingSite: CourseBlockTrainingSiteEntity;

  @ManyToOne(
    () => BlockTrainingTimeSlotEntity,
    (blockTimeslot) => blockTimeslot.blockTrainingSite,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn()
  blockTimeSlot: BlockTrainingTimeSlotEntity;
}
