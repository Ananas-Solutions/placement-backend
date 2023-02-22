import { Courses } from 'src/courses/entity/courses.entity';
import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DepartmentUnitEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  evaluation: any;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  evaluator: User;

  @ManyToOne(() => DepartmentUnits, { cascade: true })
  @JoinColumn()
  departmentUnit: DepartmentUnits;

  @ManyToOne(() => Courses, { cascade: true })
  @JoinColumn()
  course: Courses;
}
