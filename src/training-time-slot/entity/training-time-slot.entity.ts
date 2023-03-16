import { CourseTrainingSite } from 'src/courses/entity/course-training-site.entity';
import { Placement } from 'src/placement/entity/placement.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TrainingDaysEnum } from '../types/training-site-days.enum';

@Entity()
export class TrainingTimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TrainingDaysEnum, array: true })
  day: TrainingDaysEnum[];

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

  @OneToMany(() => Placement, (placement) => placement.timeSlot)
  placements: Placement[];

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  supervisor: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
