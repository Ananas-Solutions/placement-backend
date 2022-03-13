import { Exclude } from 'class-transformer';
import { CollegeDepartent } from 'src/college-department/entity/college-department.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique('unique_course', ['name', 'department', 'semester'])
export class Courses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => CollegeDepartent, {
    cascade: true,
  })
  @JoinColumn()
  department: CollegeDepartent;

  @ManyToOne(() => Semester, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  semester: Semester;

  @CreateDateColumn()
  createdAt: string;

  @CreateDateColumn()
  updatedAt: string;
}
