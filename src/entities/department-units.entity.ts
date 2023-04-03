import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import {
  CourseTrainingSiteEntity,
  CustomBaseEntity,
  DepartmentEntity,
  SupervisorDepartmentUnitEntity,
} from './index.entity';

@Entity()
export class DepartmentUnitEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  speciality: string;

  @ManyToOne(() => DepartmentEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  department: DepartmentEntity;

  @OneToMany(() => SupervisorDepartmentUnitEntity, (ds) => ds.departmentUnit, {
    cascade: ['update', 'soft-remove'],
  })
  departmentSupervisor: SupervisorDepartmentUnitEntity[];

  @OneToMany(
    () => CourseTrainingSiteEntity,
    (course) => course.departmentUnit,
    { cascade: ['update', 'soft-remove'] },
  )
  trainingSites: CourseTrainingSiteEntity[];
}
