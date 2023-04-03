import { Column, Entity, OneToMany } from 'typeorm';

import {
  CoordinatorCollegeDepartmentEntity,
  CustomBaseEntity,
} from './index.entity';

@Entity()
export class CollegeDepartmentEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @OneToMany(
    () => CoordinatorCollegeDepartmentEntity,
    (coordinatorCollege) => coordinatorCollege.department,
    { cascade: ['update', 'soft-remove'], eager: true },
  )
  coordinators: CoordinatorCollegeDepartmentEntity[];
}
