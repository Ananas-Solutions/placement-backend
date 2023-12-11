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

  @Column({ default: '' })
  contactEmail: string;

  @OneToMany(
    () => CoordinatorCollegeDepartmentEntity,
    (coordinatorCollege) => coordinatorCollege.department,
    { cascade: true },
  )
  coordinators: CoordinatorCollegeDepartmentEntity[];

  @OneToMany(() => CourseEntity, (course) => course.department, {
    cascade: true,
  })
  courses: CourseEntity[];
}
