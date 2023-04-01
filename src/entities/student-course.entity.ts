import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseEntity } from './courses.entity';
import { UserEntity } from './user.entity';

@Entity()
export class StudentCourseEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  student: UserEntity;

  @ManyToOne(() => CourseEntity, (course) => course.student, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: CourseEntity;
}
