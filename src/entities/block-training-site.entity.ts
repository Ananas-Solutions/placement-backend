import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import {
  CustomBaseEntity,
  DepartmentUnitEntity,
  PlacementEntity,
} from './index.entity';
import { CourseBlockEntity } from './course-block.entity';
import { BlockTrainingTimeSlotEntity } from './block-training-time-slot.entity';

@Entity()
export class CourseBlockTrainingSiteEntity extends CustomBaseEntity {
  @ManyToOne(() => CourseBlockEntity, (block) => block.blockTrainingSites, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  public block: CourseBlockEntity;

  @ManyToOne(
    () => DepartmentUnitEntity,
    (departmentUnit) => departmentUnit.blockTrainingSites,
    {
      onDelete: 'CASCADE',
      eager: false,
    },
  )
  @JoinColumn()
  public departmentUnit: DepartmentUnitEntity;

  @OneToMany(
    () => BlockTrainingTimeSlotEntity,
    (timeslots) => timeslots.blockTrainingSite,
    { cascade: ['update', 'soft-remove'], eager: false },
  )
  blockTimeslots: BlockTrainingTimeSlotEntity[];

  @OneToMany(
    () => PlacementEntity,
    (placement) => placement.blockTrainingSite,
    {
      cascade: ['update', 'soft-remove'],
      eager: false,
    },
  )
  placement: PlacementEntity[];
}
