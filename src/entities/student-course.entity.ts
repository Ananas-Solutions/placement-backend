import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CourseEntity, CustomBaseEntity, UserEntity } from './index.entity';
import { CourseBlockEntity } from './course-block.entity';

@Entity()
export class StudentCourseEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'], eager: false })
  @JoinColumn()
  student: UserEntity;

  @ManyToOne(() => CourseEntity, (course) => course.student, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  course: CourseEntity;

  @ManyToOne(() => CourseBlockEntity, (block) => block.students, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  block: CourseBlockEntity;
}
