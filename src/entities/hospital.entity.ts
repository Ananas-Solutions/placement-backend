import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { AuthorityEntity, DepartmentEntity } from './index.entity';

@Entity()
export class HospitalEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  location: any;

  @ManyToOne(() => AuthorityEntity, (authority) => authority.hospitals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  authority: AuthorityEntity;

  @OneToMany(() => DepartmentEntity, (department) => department.hospital, {
    cascade: ['update', 'soft-remove'],
  })
  departments: DepartmentEntity[];
}
