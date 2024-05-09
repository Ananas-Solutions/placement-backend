import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseEntity } from './courses.entity';

@Entity()
export class MasterUserDocumentEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  isMandatory: boolean;

  @Column()
  implication: string;

  @ManyToOne(() => CourseEntity)
  @JoinColumn()
  course: CourseEntity;
}
