import { CourseTrainingSite } from 'src/courses/entity/course-training-site.entity';
import { Courses } from 'src/courses/entity/courses.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class TrainingSiteEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  evaluation: any;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  evaluator: User;

  @ManyToOne(() => CourseTrainingSite, { cascade: true })
  @JoinColumn()
  trainingSite: CourseTrainingSite;

  @ManyToOne(() => Courses, { cascade: true })
  @JoinColumn()
  course: Courses;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
