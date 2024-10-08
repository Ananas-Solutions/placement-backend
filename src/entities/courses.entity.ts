import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import {
  CollegeDepartmentEntity,
  CourseCoordinatorEntity,
  CourseTrainingSiteEntity,
  CustomBaseEntity,
  SemesterEntity,
  StudentCourseEntity,
  UserEntity,
} from './index.entity';
import { CourseBlockEntity } from './course-block.entity';

@Entity()
export class CourseEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'date', default: new Date() })
  startsFrom: Date;

  @Column({ type: 'date', default: new Date() })
  endsAt: Date;

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;

  @Column({ nullable: true })
  blockType?: string;

  @Column({ default: 0, nullable: true })
  creditHours: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', eager: false })
  @JoinColumn()
  coordinator: UserEntity;

  @ManyToOne(
    () => CollegeDepartmentEntity,
    (department) => department.courses,
    {
      onDelete: 'CASCADE',
      eager: false,
    },
  )
  @JoinColumn()
  department: CollegeDepartmentEntity;

  @ManyToOne(() => SemesterEntity, (semester) => semester.course, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  semester: SemesterEntity;

  @OneToMany(() => CourseTrainingSiteEntity, (ts) => ts.course, {
    cascade: ['update', 'soft-remove'],
    eager: false,
  })
  trainingSite: CourseTrainingSiteEntity[];

  @OneToMany(() => StudentCourseEntity, (students) => students.course, {
    cascade: ['update', 'soft-remove'],
    eager: false,
  })
  student: StudentCourseEntity[];

  @OneToMany(() => CourseBlockEntity, (block) => block.course, {
    cascade: true,
    eager: false,
  })
  blocks: CourseBlockEntity[];

  @OneToMany(
    () => CourseCoordinatorEntity,
    (coordinator) => coordinator.course,
    { cascade: true, eager: false },
  )
  courseCoordinator: CourseCoordinatorEntity[];
}
