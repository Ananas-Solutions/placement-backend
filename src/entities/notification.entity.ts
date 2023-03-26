import { Entity, Column, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity()
export class NotificationEntity extends CustomBaseEntity {
  @Column()
  message: string;

  @Column()
  contentUrl: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'date', nullable: true })
  readAt: Date;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
