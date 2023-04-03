import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import {
  CourseTrainingSiteEntity,
  CustomBaseEntity,
  PlacementEntity,
  UserEntity,
} from './index.entity';

@Entity()
export class TrainingTimeSlotEntity extends CustomBaseEntity {
  @Column({ type: 'jsonb' })
  day: string[];

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  capacity: number;

  @ManyToOne(
    () => CourseTrainingSiteEntity,
    (trainingSite) => trainingSite.timeslots,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  trainingSite: CourseTrainingSiteEntity;

  @OneToMany(() => PlacementEntity, (placement) => placement.timeSlot, {
    cascade: ['update', 'soft-remove'],
  })
  placements: PlacementEntity[];

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  supervisor: UserEntity;
}
