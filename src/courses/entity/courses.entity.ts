import { Exclude } from 'class-transformer';
import { CollegeDepartent } from 'src/college-department/entity/college-department.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import { TrainingSite } from 'src/training-site/entity/training-site.entity';
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

  @OneToOne(() => User)
  coordinator: User;

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

  @OneToMany(() => TrainingSite, (trainingSite) => trainingSite.course)
  trainingSite: TrainingSite[];

  @CreateDateColumn()
  createdAt: string;

  @CreateDateColumn()
  updatedAt: string;
}
