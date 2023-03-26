import { Column, Entity } from 'typeorm';

import { CustomBaseEntity } from './base.entity';

@Entity()
export class CollegeDepartmentEntity extends CustomBaseEntity {
  @Column()
  name: string;
}
