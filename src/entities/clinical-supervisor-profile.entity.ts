import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import {
  CustomBaseEntity,
  DepartmentEntity,
  HospitalEntity,
  UserEntity,
} from './index.entity';

@Entity()
export class SupervisorProfileEntity extends CustomBaseEntity {
  @Column({ nullable: true })
  profilePicture: string;

  @Column()
  qualification: string;

  @Column()
  nationality: string;

  @Column()
  speciality: string;

  @Column()
  experienceYears: number;

  @Column()
  mobile: string;

  @Column({ nullable: true })
  alternativeEmail: string;

  @OneToOne(() => HospitalEntity, {
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  @JoinColumn()
  hospital: HospitalEntity;

  @OneToOne(() => DepartmentEntity, {
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  @JoinColumn()
  department: DepartmentEntity;

  @OneToOne(() => UserEntity, (user) => user.id, {
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  @JoinColumn()
  user: UserEntity;
}
