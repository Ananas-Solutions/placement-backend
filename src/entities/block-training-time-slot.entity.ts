import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity, UserEntity } from './index.entity';
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
    },
  )
  @JoinColumn()
  blockTrainingSite: CourseBlockTrainingSiteEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  supervisor: UserEntity;
}
