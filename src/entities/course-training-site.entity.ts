import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseEntity } from './courses.entity';
import { DepartmentUnitEntity } from './department-units.entity';
import { TrainingTimeSlotEntity } from './training-time-slot.entity';

@Entity()
export class CourseTrainingSiteEntity extends CustomBaseEntity {
  @ManyToOne(() => CourseEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  public course: CourseEntity;

  @ManyToOne(() => DepartmentUnitEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  public departmentUnit: DepartmentUnitEntity;

  @OneToMany(
    () => TrainingTimeSlotEntity,
    (timeslots) => timeslots.trainingSite,
  )
  timeslots: TrainingTimeSlotEntity[];
}
