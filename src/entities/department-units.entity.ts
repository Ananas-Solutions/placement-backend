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
import { CourseBlockTrainingSiteEntity } from './block-training-site.entity';

@Entity()
export class DepartmentUnitEntity extends CustomBaseEntity {
  @Index()
  @Column()
  name: string;

  @Column({ nullable: true })
  speciality: string;

  @Column({ default: '', nullable: true })
  contactEmail?: string;

  @ManyToOne(() => DepartmentEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  department: DepartmentEntity;

  @OneToMany(() => SupervisorDepartmentUnitEntity, (ds) => ds.departmentUnit, {
    cascade: ['update', 'soft-remove'],
    eager: false,
  })
  departmentSupervisor: SupervisorDepartmentUnitEntity[];

  @OneToMany(
    () => CourseTrainingSiteEntity,
    (course) => course.departmentUnit,
    { cascade: ['update', 'soft-remove'], eager: false },
  )
  trainingSites: CourseTrainingSiteEntity[];

  @OneToMany(
    () => CourseBlockTrainingSiteEntity,
    (blockTrainingSites) => blockTrainingSites.departmentUnit,
    { cascade: ['update', 'soft-remove'], eager: false },
  )
  blockTrainingSites: CourseBlockTrainingSiteEntity[];
}
