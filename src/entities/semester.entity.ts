import { Column, Entity, OneToMany } from 'typeorm';

import { SemesterEnum } from 'commons/enums';
import { CourseEntity, CustomBaseEntity } from './index.entity';

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
    eager: false,
  })
  course: CourseEntity[];
}
