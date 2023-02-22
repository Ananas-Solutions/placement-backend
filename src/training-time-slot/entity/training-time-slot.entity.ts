import { Courses } from 'src/courses/entity/courses.entity';
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

  @ManyToOne(() => Courses, (course) => course.timeslots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: Courses;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
