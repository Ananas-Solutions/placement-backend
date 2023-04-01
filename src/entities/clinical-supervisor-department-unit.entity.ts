import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { DepartmentUnitEntity } from './department-units.entity';
import { UserEntity } from './user.entity';

@Entity()
@Unique('unique_supervisor_department_unit', ['supervisor', 'departmentUnit'])
export class SupervisorDepartmentUnitEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  public supervisor: UserEntity;

  @ManyToOne(
    () => DepartmentUnitEntity,
    (departmentUnit) => departmentUnit.departmentSupervisor,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  public departmentUnit: DepartmentUnitEntity;
}
