import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { CustomBaseEntity, UserEntity } from './index.entity';

@Entity()
export class CoordinatorProfileEntity extends CustomBaseEntity {
  @Column()
  mobile: string;

  @Column()
  address: string;

  @OneToOne(() => UserEntity, { cascade: ['soft-remove'], eager: false })
  @JoinColumn()
  user: UserEntity;
}
