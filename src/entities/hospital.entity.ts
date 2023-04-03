import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import {
  CustomBaseEntity,
  AuthorityEntity,
  DepartmentEntity,
} from './index.entity';

interface HospitalLocationInterface {
  latLng: {
    lat: number;
    lng: number;
  };
  detailedName: string;
}

@Entity()
export class HospitalEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Index()
  @Column({ type: 'jsonb' })
  location: HospitalLocationInterface;

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
