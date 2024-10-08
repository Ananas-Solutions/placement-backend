import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity, PlacementEntity, UserEntity } from './index.entity';
import { CourseBlockTrainingSiteEntity } from './block-training-site.entity';

@Entity()
export class BlockTrainingTimeSlotEntity extends CustomBaseEntity {
  @Column({ type: 'jsonb' })
  day: string[];

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  capacity: number;

  @ManyToOne(
    () => CourseBlockTrainingSiteEntity,
    (blockTrainingSite) => blockTrainingSite.blockTimeslots,
    {
      onDelete: 'CASCADE',
      eager: false,
    },
  )
  @JoinColumn()
  blockTrainingSite: CourseBlockTrainingSiteEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', eager: false })
  @JoinColumn()
  supervisor: UserEntity;

  @OneToMany(() => PlacementEntity, (placement) => placement.blockTimeSlot, {
    cascade: ['update', 'soft-remove'],
    eager: false,
  })
  placements: PlacementEntity[];
}
