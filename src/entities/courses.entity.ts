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
import { StudentCourseEntity } from './student-course.entity';

@Entity()
@Unique('unique_course', ['name', 'department', 'semester'])
export class CourseEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'date', default: new Date() })
  startsFrom: Date;

  @Column({ type: 'date', default: new Date() })
  endsAt: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  coordinator: UserEntity;

  @ManyToOne(
    () => CollegeDepartmentEntity,
    (department) => department.coordinators,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  department: CollegeDepartmentEntity;

  @ManyToOne(() => SemesterEntity, (semester) => semester.course, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  semester: SemesterEntity;

  @OneToMany(() => CourseTrainingSiteEntity, (ts) => ts.course, {
    cascade: ['update', 'soft-remove'],
  })
  trainingSite: CourseTrainingSiteEntity[];

  @OneToMany(() => StudentCourseEntity, (students) => students.course, {
    cascade: ['update', 'soft-remove'],
  })
  student: StudentCourseEntity[];
}
