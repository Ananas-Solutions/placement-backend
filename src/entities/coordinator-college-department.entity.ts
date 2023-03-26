import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CollegeDepartmentEntity } from './college-department.entity';
import { UserEntity } from './user.entity';

@Entity()
export class CoordinatorCollegeDepartmentEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  coordinator: UserEntity;

  @ManyToOne(() => CollegeDepartmentEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  department: CollegeDepartmentEntity;
}
