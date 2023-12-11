import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import {
  CourseEntity,
  CustomBaseEntity,
  DepartmentUnitEntity,
  PlacementEntity,
  TrainingSiteEvaluationEntity,
  TrainingTimeSlotEntity,
} from './index.entity';

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
    { cascade: true },
  )
  timeslots: TrainingTimeSlotEntity[];

  @OneToMany(() => PlacementEntity, (placement) => placement.trainingSite, {
    cascade: true,
  })
  placement: PlacementEntity[];

  @OneToMany(
    () => TrainingSiteEvaluationEntity,
    (trainingSiteEvaluation) => trainingSiteEvaluation.trainingSite,
    {
      cascade: true,
    },
  )
  trainingSiteEvaluation: TrainingSiteEvaluationEntity[];
}
