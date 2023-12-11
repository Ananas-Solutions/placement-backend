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
  CoordinatorCollegeDepartmentEntity,
  CustomBaseEntity,
  DepartmentUnitEntity,
  HospitalEntity,
  SupervisorProfileEntity,
} from './index.entity';

@Entity()
export class DepartmentEntity extends CustomBaseEntity {
  @Index()
  @Column()
  name: string;

  @Column({ default: '' })
  contactEmail: string;

  @ManyToOne(() => HospitalEntity, (hospital) => hospital.departments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  hospital: HospitalEntity;

  @OneToMany(
    () => DepartmentUnitEntity,
    (departmentUnit) => departmentUnit.department,
    {
      cascade: true,
    },
  )
  departmentUnits: DepartmentUnitEntity[];

  @OneToMany(
    () => CoordinatorCollegeDepartmentEntity,
    (departmentCoordinator) => departmentCoordinator.department,
    {
      cascade: true,
    },
  )
  departmentCoordinators: CoordinatorCollegeDepartmentEntity[];

  @OneToOne(
    () => SupervisorProfileEntity,
    (supervisorProfile) => supervisorProfile.department,
    {
      cascade: true,
    },
  )
  clinicalSupervisorProfile: SupervisorProfileEntity;
}
