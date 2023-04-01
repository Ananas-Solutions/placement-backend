import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CollegeDepartmentEntity } from './college-department.entity';
import { UserEntity } from './user.entity';

@Entity()
export class CoordinatorCollegeDepartmentEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'] })
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
