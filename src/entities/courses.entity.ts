import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';

import {
  CollegeDepartmentEntity,
  CourseTrainingSiteEntity,
  CustomBaseEntity,
  SemesterEntity,
  StudentCourseEntity,
  UserEntity,
} from './index.entity';

@Entity()
@Unique('unique_course', ['name', 'department', 'semester'])
export class CourseEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'date', default: new Date() })
  startsFrom: Date;

  @Column({ type: 'date', default: new Date() })
  endsAt: Date;

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  coordinator: UserEntity;

  @ManyToOne(
    () => CollegeDepartmentEntity,
    (department) => department.courses,
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
    eager: true,
  })
  trainingSite: CourseTrainingSiteEntity[];

  @OneToMany(() => StudentCourseEntity, (students) => students.course, {
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  student: StudentCourseEntity[];
}
