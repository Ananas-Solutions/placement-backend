import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CourseEntity, CustomBaseEntity, UserEntity } from './index.entity';

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
