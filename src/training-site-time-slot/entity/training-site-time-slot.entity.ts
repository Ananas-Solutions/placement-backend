import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
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
    () => DepartmentUnits,
    (departmentUnit) => departmentUnit.timeslots,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  departmentUnit: DepartmentUnits;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
