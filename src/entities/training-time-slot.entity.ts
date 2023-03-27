import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseTrainingSiteEntity } from './course-training-site.entity';
import { PlacementEntity } from './placement.entity';
import { UserEntity } from './user.entity';

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
      cascade: ['soft-remove'],
    },
  )
  @JoinColumn()
  trainingSite: CourseTrainingSiteEntity;

  @OneToMany(() => PlacementEntity, (placement) => placement.timeSlot)
  placements: PlacementEntity[];

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  supervisor: UserEntity;
}