import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { SupervisorDepartmentUnitEntity } from './clinical-supervisor-department-unit.entity';
import { DepartmentEntity } from './department.entity';

@Entity()
export class DepartmentUnitEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  speciality: string;

  @ManyToOne(() => DepartmentEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  department: DepartmentEntity;

  @OneToMany(() => SupervisorDepartmentUnitEntity, (ds) => ds.departmentUnit)
  departmentSupervisor: SupervisorDepartmentUnitEntity[];
}
