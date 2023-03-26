import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CollegeDepartmentEntity } from './college-department.entity';
import { CourseTrainingSiteEntity } from './course-training-site.entity';
import { SemesterEntity } from './semester.entity';
import { UserEntity } from './user.entity';

@Entity()
@Unique('unique_course', ['name', 'department', 'semester'])
export class CourseEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'date', default: new Date() })
  startsFrom: Date;

  @Column({ type: 'date', default: new Date() })
  endsAt: Date;

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  coordinator: UserEntity;

  @ManyToOne(() => CollegeDepartmentEntity, {
    cascade: ['soft-remove'],
  })
  @JoinColumn()
  department: CollegeDepartmentEntity;

  @ManyToOne(() => SemesterEntity, {
    cascade: ['soft-remove'],
  })
  @JoinColumn()
  semester: SemesterEntity;

  @OneToMany(() => CourseTrainingSiteEntity, (ts) => ts.course)
  trainingSite: CourseTrainingSiteEntity[];
}
