import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  CollegeDepartmentEntity,
  CustomBaseEntity,
  UserEntity,
} from './index.entity';

@Entity()
export class CoordinatorCollegeDepartmentEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', eager: false })
  @JoinColumn()
  coordinator: UserEntity;

  @ManyToOne(
    () => CollegeDepartmentEntity,
    (department) => department.coordinators,
    { onDelete: 'CASCADE', eager: false },
  )
  @JoinColumn()
  department: CollegeDepartmentEntity;
}
