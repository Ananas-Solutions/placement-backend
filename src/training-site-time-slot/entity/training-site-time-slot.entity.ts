import { TrainingSite } from 'src/training-site/entity/training-site.entity';
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
export class TrainingSiteTimeSlot {
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
    () => TrainingSite,
    (trainingSite) => trainingSite.trainingTimeSlots,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  trainingSite: TrainingSite;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
