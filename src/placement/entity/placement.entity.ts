import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { TrainingTimeSlot } from 'src/training-time-slot/entity/training-time-slot.entity';

import { User } from 'src/user/entity/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Placement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  student: User;

  @ManyToOne(() => DepartmentUnits, { cascade: true, onDelete: 'CASCADE' })
  departmentUnit: DepartmentUnits;

  @ManyToOne(() => TrainingTimeSlot, { cascade: true, onDelete: 'CASCADE' })
  timeSlot: TrainingTimeSlot;
}
