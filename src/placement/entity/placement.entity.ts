import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { TrainingSiteTimeSlot } from 'src/training-site-time-slot/entity/training-site-time-slot.entity';
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

  @ManyToOne(() => TrainingSiteTimeSlot, { cascade: true, onDelete: 'CASCADE' })
  timeSlot: TrainingSiteTimeSlot;
}
