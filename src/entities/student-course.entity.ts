import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CourseEntity, CustomBaseEntity, UserEntity } from './index.entity';

@Entity()
export class StudentCourseEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.studentCourses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student: UserEntity;

  @ManyToOne(() => CourseEntity, (course) => course.student, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: CourseEntity;
}
