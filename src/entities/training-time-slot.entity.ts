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
      eager: false,
    },
  )
  @JoinColumn()
  trainingSite: CourseTrainingSiteEntity;

  @OneToMany(() => PlacementEntity, (placement) => placement.timeSlot, {
    cascade: ['update', 'soft-remove'],
    eager: false,
  })
  placements: PlacementEntity[];

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', eager: false })
  @JoinColumn()
  supervisor: UserEntity;
}
