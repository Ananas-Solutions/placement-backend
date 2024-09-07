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

  @Column({ default: '', nullable: true })
  contactEmail?: string;

  @ManyToOne(() => AuthorityEntity, (authority) => authority.hospitals, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  authority: AuthorityEntity;

  @OneToMany(() => DepartmentEntity, (department) => department.hospital, {
    cascade: ['update', 'soft-remove'],
    eager: false,
  })
  departments: DepartmentEntity[];
}
