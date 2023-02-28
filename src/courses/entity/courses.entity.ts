import { CollegeDepartment } from 'src/college-department/entity/college-department.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CourseTrainingSite } from './course-training-site.entity';

@Entity()
@Unique('unique_course', ['name', 'department', 'semester'])
export class Courses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date', default: new Date() })
  startsFrom: Date;

  @Column({ type: 'date', default: new Date() })
  endsAt: Date;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  coordinator: User;

  @ManyToOne(() => CollegeDepartment, {
    cascade: true,
  })
  @JoinColumn()
  department: CollegeDepartment;

  @ManyToOne(() => Semester, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  semester: Semester;

  @OneToMany(() => CourseTrainingSite, (ts) => ts.course)
  trainingSite: CourseTrainingSite[];

  @CreateDateColumn()
  createdAt: string;

  @CreateDateColumn()
  updatedAt: string;
}
