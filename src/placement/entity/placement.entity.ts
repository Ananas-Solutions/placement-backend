import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { TrainingTimeSlot } from 'src/training-time-slot/entity/training-time-slot.entity';
import { User } from 'src/user/entity/user.entity';

@Entity()
export class Placement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  student: User;

  @ManyToOne(() => DepartmentUnits, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  departmentUnit: DepartmentUnits;

  @ManyToOne(() => TrainingTimeSlot, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  timeSlot: TrainingTimeSlot;
}
