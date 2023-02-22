import { Courses } from 'src/courses/entity/courses.entity';
import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SupervisorEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  evaluation: any;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  evaluator: User;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  evaluatee: User;

  @ManyToOne(() => Courses, { cascade: true })
  @JoinColumn()
  course: Courses;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
