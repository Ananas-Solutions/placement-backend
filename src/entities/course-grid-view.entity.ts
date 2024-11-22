import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CourseEntity } from './courses.entity';
import { CustomBaseEntity } from './base.entity';

@Entity()
export class CourseGridViewEntity extends CustomBaseEntity {
  @Column({ type: 'jsonb' })
  layout: any;

  @ManyToOne(() => CourseEntity)
  @JoinColumn()
  course: CourseEntity;
}
