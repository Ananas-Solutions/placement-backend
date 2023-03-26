import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { HospitalEntity } from './hospital.entity';

@Entity()
export class AuthorityEntity extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  initials: string;

  @Column()
  name: string;

  @OneToMany(() => HospitalEntity, (hospital) => hospital.authority)
  hospitals: HospitalEntity[];
}
