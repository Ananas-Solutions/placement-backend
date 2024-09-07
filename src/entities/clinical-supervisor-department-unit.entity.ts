import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  CustomBaseEntity,
  DepartmentUnitEntity,
  UserEntity,
} from './index.entity';

@Entity()
export class SupervisorDepartmentUnitEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', eager: false })
  @JoinColumn()
  public supervisor: UserEntity;

  @ManyToOne(
    () => DepartmentUnitEntity,
    (departmentUnit) => departmentUnit.departmentSupervisor,
    { onDelete: 'CASCADE', eager: false },
  )
  @JoinColumn()
  public departmentUnit: DepartmentUnitEntity;
}
