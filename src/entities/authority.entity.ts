import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { HospitalEntity } from './index.entity';

@Entity()
export class AuthorityEntity extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  initials: string;

  @Index()
  @Column()
  name: string;

  @Column({ default: '' })
  contactEmail: string;

  @OneToMany(() => HospitalEntity, (hospital) => hospital.authority, {
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  hospitals: HospitalEntity[];
}
