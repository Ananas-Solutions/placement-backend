import { Column, Entity } from 'typeorm';

import { SemesterEnum } from 'commons/enums';

import { CustomBaseEntity } from './base.entity';

@Entity()
export class SemesterEntity extends CustomBaseEntity {
  @Column({ type: 'enum', enum: SemesterEnum })
  semester: SemesterEnum;

  @Column()
  startYear: string;

  @Column()
  endYear: string;
}
