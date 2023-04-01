import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CoordinatorCollegeDepartmentEntity } from './coordinator-college-department.entity';
import { DepartmentUnitEntity } from './department-units.entity';
import { HospitalEntity } from './hospital.entity';

@Entity()
export class DepartmentEntity extends CustomBaseEntity {
  @Column()
  name: string;

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
    },
  )
  departmentUnits: DepartmentUnitEntity[];

  @OneToMany(
    () => CoordinatorCollegeDepartmentEntity,
    (departmentCoordinator) => departmentCoordinator.department,
  )
  departmentCoordinators: CoordinatorCollegeDepartmentEntity[];
}
