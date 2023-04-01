import { Column, Entity, OneToMany } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CoordinatorCollegeDepartmentEntity } from './coordinator-college-department.entity';

@Entity()
export class CollegeDepartmentEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @OneToMany(
    () => CoordinatorCollegeDepartmentEntity,
    (coordinatorCollege) => coordinatorCollege.department,
    { cascade: ['update', 'soft-remove'] },
  )
  coordinators: CoordinatorCollegeDepartmentEntity[];
}
