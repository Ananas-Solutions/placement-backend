import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AuthorityEntity } from './authority.entity';
import { CustomBaseEntity } from './base.entity';
import { DepartmentEntity } from './department.entity';

@Entity()
export class HospitalEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  location: any;

  @ManyToOne(() => AuthorityEntity, (authority) => authority.id, {
    cascade: ['soft-remove'],
  })
  @JoinColumn()
  authority: AuthorityEntity;

  @OneToMany(() => DepartmentEntity, (department) => department.hospital)
  departments: DepartmentEntity[];
}
