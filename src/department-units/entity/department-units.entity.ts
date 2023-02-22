import { Department } from 'src/department/entity/department.entity';
import { TrainingSiteTimeSlot } from 'src/training-site-time-slot/entity/training-site-time-slot.entity';
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

@Entity()
export class DepartmentUnits {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  speciality: string;

  @ManyToOne(() => Department, { onDelete: 'CASCADE' })
  @JoinColumn()
  department: Department;

  @OneToMany(
    () => TrainingSiteTimeSlot,
    (timeslots) => timeslots.departmentUnit,
    { cascade: true },
  )
  timeslots: TrainingSiteTimeSlot[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
