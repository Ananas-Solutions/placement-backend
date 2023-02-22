import { SupervisorDepartmentUnit } from 'src/clinical-supervisor/entity/clinical-supervisor-department-unit.entity';
import { Department } from 'src/department/entity/department.entity';
import { TrainingTimeSlot } from 'src/training-time-slot/entity/training-time-slot.entity';
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

  @OneToMany(() => SupervisorDepartmentUnit, (ds) => ds.departmentUnit)
  departmentSupervisor: SupervisorDepartmentUnit;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
