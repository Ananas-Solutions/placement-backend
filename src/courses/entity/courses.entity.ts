import { Exclude } from 'class-transformer';
import { CollegeDepartment } from 'src/college-department/entity/college-department.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import { TrainingTimeSlot } from 'src/training-time-slot/entity/training-time-slot.entity';
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

  @CreateDateColumn()
  createdAt: string;

  @CreateDateColumn()
  updatedAt: string;
}
