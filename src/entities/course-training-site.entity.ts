import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseEntity } from './courses.entity';
import { DepartmentUnitEntity } from './department-units.entity';
import { TrainingTimeSlotEntity } from './training-time-slot.entity';
import { PlacementEntity } from './placement.entity';

@Entity()
export class CourseTrainingSiteEntity extends CustomBaseEntity {
  @ManyToOne(() => CourseEntity, (course) => course.trainingSite, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public course: CourseEntity;

  @ManyToOne(() => DepartmentUnitEntity, (unit) => unit.trainingSites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public departmentUnit: DepartmentUnitEntity;

  @OneToMany(
    () => TrainingTimeSlotEntity,
    (timeslots) => timeslots.trainingSite,
    { cascade: ['update', 'soft-remove'] },
  )
  timeslots: TrainingTimeSlotEntity[];

  @OneToMany(() => PlacementEntity, (placement) => placement.trainingSite, {
    cascade: ['update', 'soft-remove'],
  })
  placement: PlacementEntity[];
}
