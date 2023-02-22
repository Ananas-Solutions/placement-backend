import { Department } from 'src/department/entity/department.entity';
import { TrainingTimeSlot } from 'src/training-time-slot/entity/training-time-slot.entity';
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
