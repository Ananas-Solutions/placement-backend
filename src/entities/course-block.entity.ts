import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseEntity } from './courses.entity';
import { StudentCourseEntity } from './student-course.entity';
import { CourseBlockTrainingSiteEntity } from './block-training-site.entity';

@Entity()
export class CourseBlockEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'date', default: new Date() })
  startsFrom: Date;

  @Column({ type: 'date', default: new Date() })
  endsAt: Date;

  @Column()
  capacity: number;

  @Column()
  duration: number;

  @ManyToOne(() => CourseEntity, (course) => course.blocks, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  course: CourseEntity;

  @OneToMany(() => StudentCourseEntity, (block) => block.course, {
    cascade: true,
    eager: false,
  })
  students: StudentCourseEntity[];

  @OneToMany(() => CourseBlockTrainingSiteEntity, (block) => block.block, {
    cascade: true,
    eager: false,
  })
  blockTrainingSites: CourseBlockTrainingSiteEntity[];
}
