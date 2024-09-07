import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CourseEntity, CustomBaseEntity, UserEntity } from './index.entity';

@Entity()
export class CourseCoordinatorEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', eager: false })
  @JoinColumn()
  coordinator: UserEntity;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE', eager: false })
  @JoinColumn()
  course: CourseEntity;
}
