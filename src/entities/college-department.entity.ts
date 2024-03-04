import { Column, Entity, OneToMany } from 'typeorm';

import {
  CoordinatorCollegeDepartmentEntity,
  CourseEntity,
  CustomBaseEntity,
} from './index.entity';

@Entity()
export class CollegeDepartmentEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ default: '', nullable: true })
  contactEmail?: string;

  @OneToMany(
    () => CoordinatorCollegeDepartmentEntity,
    (coordinatorCollege) => coordinatorCollege.department,
    { cascade: ['update', 'soft-remove'], eager: true },
  )
  coordinators: CoordinatorCollegeDepartmentEntity[];

  @OneToMany(() => CourseEntity, (course) => course.department, {
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  courses: CourseEntity[];
}
