import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import {
  CollegeDepartmentEntity,
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

  @OneToMany(() => CourseBlockEntity, (block) => block.course, {
    cascade: true,
  })
  blocks: CourseBlockEntity[];
}
