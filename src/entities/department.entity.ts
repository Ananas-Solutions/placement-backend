import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import {
  CoordinatorCollegeDepartmentEntity,
  CustomBaseEntity,
  DepartmentUnitEntity,
  HospitalEntity,
} from './index.entity';

@Entity()
export class DepartmentEntity extends CustomBaseEntity {
  @Index()
  @Column()
  name: string;

  @Column({ default: '', nullable: true })
  contactEmail?: string;

  @ManyToOne(() => HospitalEntity, (hospital) => hospital.departments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  hospital: HospitalEntity;

  @OneToMany(
    () => DepartmentUnitEntity,
    (departmentUnit) => departmentUnit.department,
    {
      cascade: ['update', 'soft-remove'],
      eager: true,
    },
  )
  departmentUnits: DepartmentUnitEntity[];

  @OneToMany(
    () => CoordinatorCollegeDepartmentEntity,
    (departmentCoordinator) => departmentCoordinator.department,
    {
      cascade: ['update', 'soft-remove'],
      eager: true,
    },
  )
  departmentCoordinators: CoordinatorCollegeDepartmentEntity[];
}
