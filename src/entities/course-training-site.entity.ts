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
    eager: false,
  })
  @JoinColumn()
  public course: CourseEntity;

  @ManyToOne(
    () => DepartmentUnitEntity,
    (departmentUnit) => departmentUnit.trainingSites,
    {
      onDelete: 'CASCADE',
      eager: false,
    },
  )
  @JoinColumn()
  public departmentUnit: DepartmentUnitEntity;

  @OneToMany(
    () => TrainingTimeSlotEntity,
    (timeslots) => timeslots.trainingSite,
    { cascade: ['update', 'soft-remove'], eager: false },
  )
  timeslots: TrainingTimeSlotEntity[];

  @OneToMany(() => PlacementEntity, (placement) => placement.trainingSite, {
    cascade: ['update', 'soft-remove'],
    eager: false,
  })
  placement: PlacementEntity[];

  // @OneToMany(
  //   () => TrainingSiteAttendanceEntity,
  //   (attendance) => attendance.courseTrainingSite,
  //   { cascade: true },
  // )
  // attendance: TrainingSiteAttendanceEntity[];
}
