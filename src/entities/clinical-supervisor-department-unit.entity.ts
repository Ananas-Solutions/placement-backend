import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  CustomBaseEntity,
  DepartmentUnitEntity,
  UserEntity,
} from './index.entity';

@Entity()
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
