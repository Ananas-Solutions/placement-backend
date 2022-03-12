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

@Entity()
export class TrainingSiteTimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

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
