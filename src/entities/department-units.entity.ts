import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import {
  CourseTrainingSiteEntity,
  CustomBaseEntity,
  DepartmentEntity,
  SupervisorDepartmentUnitEntity,
} from './index.entity';

@Entity()
export class DepartmentUnitEntity extends CustomBaseEntity {
  @Index()
  @Column()
  name: string;

  @Column({ nullable: true })
  speciality: string;

  @Column({ default: '' })
  contactEmail: string;

  @ManyToOne(() => DepartmentEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  department: DepartmentEntity;

  @OneToMany(() => SupervisorDepartmentUnitEntity, (ds) => ds.departmentUnit, {
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  departmentSupervisor: SupervisorDepartmentUnitEntity[];

  @OneToMany(
    () => CourseTrainingSiteEntity,
    (course) => course.departmentUnit,
    { cascade: ['update', 'soft-remove'], eager: true },
  )
  trainingSites: CourseTrainingSiteEntity[];
}
