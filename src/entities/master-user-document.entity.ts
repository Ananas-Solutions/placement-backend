import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseEntity } from './courses.entity';

@Entity()
export class MasterUserDocumentEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ default: false })
  isMandatory: boolean;

  @Column()
  implication: string;

  @Column()
  comment: string;

  @ManyToOne(() => CourseEntity, { eager: false })
  @JoinColumn()
  course: CourseEntity;
}
