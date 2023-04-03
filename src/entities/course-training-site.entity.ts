import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import {
  CourseEntity,
  CustomBaseEntity,
  DepartmentUnitEntity,
  PlacementEntity,
  TrainingTimeSlotEntity,
} from './index.entity';

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
    { cascade: ['update', 'soft-remove'], eager: true },
  )
  timeslots: TrainingTimeSlotEntity[];

  @OneToMany(() => PlacementEntity, (placement) => placement.trainingSite, {
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  placement: PlacementEntity[];
}
