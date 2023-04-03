import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  CollegeDepartmentEntity,
  CustomBaseEntity,
  UserEntity,
} from './index.entity';

@Entity()
export class CoordinatorCollegeDepartmentEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  coordinator: UserEntity;

  @ManyToOne(
    () => CollegeDepartmentEntity,
    (department) => department.coordinators,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  department: CollegeDepartmentEntity;
}
