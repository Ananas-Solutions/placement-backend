import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseEntity } from './courses.entity';
import { StudentCourseEntity } from './student-course.entity';

@Entity()
export class CourseBlockEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'date', default: new Date() })
  startsFrom: Date;

  @Column({ type: 'date', default: new Date() })
  endsAt: Date;

  @ManyToOne(() => CourseEntity, (course) => course.blocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: CourseEntity;

  @OneToMany(() => StudentCourseEntity, (block) => block.course, {
    cascade: true,
  })
  students: StudentCourseEntity[];
}
