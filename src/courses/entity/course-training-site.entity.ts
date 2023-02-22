import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { Courses } from './courses.entity';
import { TrainingTimeSlot } from 'src/training-time-slot/entity/training-time-slot.entity';

@Entity()
export class CourseTrainingSite {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => Courses, { cascade: true })
  @JoinColumn()
  public course: Courses;

  @ManyToOne(() => DepartmentUnits, { cascade: true })
  @JoinColumn()
  public departmentUnit: DepartmentUnits;

  @OneToMany(() => TrainingTimeSlot, (timeslots) => timeslots.trainingSite, {
    cascade: true,
  })
  timeslots: TrainingTimeSlot[];
}
