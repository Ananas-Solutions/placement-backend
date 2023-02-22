import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { Courses } from './courses.entity';

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
}
