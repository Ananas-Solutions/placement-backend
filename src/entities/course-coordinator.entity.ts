import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CourseEntity, CustomBaseEntity, UserEntity } from './index.entity';

@Entity()
export class CourseCoordinatorEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  coordinator: UserEntity;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  course: CourseEntity;
}
