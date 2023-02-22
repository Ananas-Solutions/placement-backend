import { Courses } from 'src/courses/entity/courses.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StudentEvaluation {
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
}
