import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique('unique_supervisor_department_unit', ['supervisor', 'departmentUnit'])
export class SupervisorDepartmentUnit {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn()
  public supervisor: User;

  @ManyToOne(() => DepartmentUnits, { cascade: true })
  @JoinColumn()
  public departmentUnit: DepartmentUnits;
}
