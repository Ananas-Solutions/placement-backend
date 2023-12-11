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

  @OneToOne(
    () => HospitalEntity,
    (hospital) => hospital.clinicalSupervisorProfile,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  hospital: HospitalEntity;

  @OneToOne(
    () => DepartmentEntity,
    (department) => department.clinicalSupervisorProfile,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  department: DepartmentEntity;

  @OneToOne(() => UserEntity, (user) => user.clinicalSupervisorProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
