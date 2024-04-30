import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import {
  CourseEntity,
  CustomBaseEntity,
  DepartmentUnitEntity,
  PlacementEntity,
  TrainingTimeSlotEntity,
} from './index.entity';
import { TrainingSiteAttendanceEntity } from './training-site-attendance.entity';

@Entity()
export class CourseTrainingSiteEntity extends CustomBaseEntity {
  @ManyToOne(() => CourseEntity, (course) => course.trainingSite, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public course: CourseEntity;

  @ManyToOne(
    () => DepartmentUnitEntity,
    (departmentUnit) => departmentUnit.trainingSites,
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
  timeslots: TrainingTimeSlotEntity[];

  @OneToMany(() => PlacementEntity, (placement) => placement.trainingSite, {
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  placement: PlacementEntity[];

  @OneToMany(
    () => TrainingSiteAttendanceEntity,
    (attendance) => attendance.courseTrainingSite,
    { cascade: true },
  )
  attendance: TrainingSiteAttendanceEntity[];
}
