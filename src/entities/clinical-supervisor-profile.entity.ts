import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { DepartmentEntity } from './department.entity';
import { HospitalEntity } from './hospital.entity';
import { UserEntity } from './user.entity';

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

  @OneToOne(() => HospitalEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  hospital: HospitalEntity;

  @OneToOne(() => DepartmentEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  department: DepartmentEntity;

  @OneToOne(() => UserEntity, (user) => user.id, {
    cascade: ['soft-remove'],
  })
  @JoinColumn()
  user: UserEntity;
}
