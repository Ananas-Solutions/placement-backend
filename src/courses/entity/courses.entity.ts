import { Department } from 'src/hospital/entity/department.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Courses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Department, (department) => department.id, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  department: Department;

  @Column()
  semester: string;

  @Column()
  year: string;

  @CreateDateColumn()
  createdAt: string;

  @CreateDateColumn()
  updatedAt: string;
}
