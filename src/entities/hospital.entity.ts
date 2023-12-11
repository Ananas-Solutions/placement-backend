import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import {
  CustomBaseEntity,
  AuthorityEntity,
  DepartmentEntity,
  SupervisorProfileEntity,
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

  @Column({ default: '' })
  contactEmail: string;

  @ManyToOne(() => AuthorityEntity, (authority) => authority.hospitals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  authority: AuthorityEntity;

  @OneToMany(() => DepartmentEntity, (department) => department.hospital, {
    cascade: true,
  })
  departments: DepartmentEntity[];

  @OneToOne(
    () => SupervisorProfileEntity,
    (supervisorProfile) => supervisorProfile.hospital,
    {
      cascade: true,
    },
  )
  clinicalSupervisorProfile: SupervisorProfileEntity;
}
