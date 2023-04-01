import { Column, Entity, OneToMany } from 'typeorm';

import { SemesterEnum } from 'commons/enums';

import { CustomBaseEntity } from './base.entity';
import { CourseEntity } from './courses.entity';

@Entity()
export class SemesterEntity extends CustomBaseEntity {
  @Column({ type: 'enum', enum: SemesterEnum })
  semester: SemesterEnum;

  @Column()
  startYear: string;

  @Column()
  endYear: string;

  @OneToMany(() => CourseEntity, (course) => course.semester, {
    cascade: ['update', 'soft-remove'],
  })
  course: CourseEntity[];
}
