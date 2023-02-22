import { CourseTrainingSite } from 'src/courses/entity/course-training-site.entity';
import { Courses } from 'src/courses/entity/courses.entity';
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
import { TrainingDaysEnum } from '../types/training-site-days.enum';

@Entity()
export class TrainingTimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TrainingDaysEnum })
  day: TrainingDaysEnum;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  capacity: number;

  @ManyToOne(
    () => CourseTrainingSite,
    (trainingSite) => trainingSite.timeslots,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  trainingSite: CourseTrainingSite;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  supervisor: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
