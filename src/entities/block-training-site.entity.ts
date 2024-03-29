import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import {
  CustomBaseEntity,
  DepartmentUnitEntity,
  PlacementEntity,
  TrainingTimeSlotEntity,
} from './index.entity';
import { CourseBlockEntity } from './course-block.entity';
import { BlockTrainingTimeSlotEntity } from './block-training-time-slot.entity';

@Entity()
export class CourseBlockTrainingSiteEntity extends CustomBaseEntity {
  @ManyToOne(() => CourseBlockEntity, (block) => block.trainingSite, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public block: CourseBlockEntity;

  @ManyToOne(
    () => DepartmentUnitEntity,
    (departmentUnit) => departmentUnit.blockTrainingSites,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  public departmentUnit: DepartmentUnitEntity;

  @OneToMany(
    () => TrainingTimeSlotEntity,
    (timeslots) => timeslots.trainingSite,
    { cascade: ['update', 'soft-remove'], eager: true },
  )
  blockTimeslots: BlockTrainingTimeSlotEntity[];

  @OneToMany(() => PlacementEntity, (placement) => placement.trainingSite, {
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  placement: PlacementEntity[];
}
