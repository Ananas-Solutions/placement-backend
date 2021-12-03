import { Department } from 'src/department/entity/department.entity';
import { Hospital } from 'src/hospital/entity/hospital.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SupervisorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column()
  qualification: string;

  @Column()
  nationality: string;

  @Column()
  speciality: string;

  @Column()
  noOfYears: number;

  @Column()
  mobile: string;

  @Column()
  email: string;

  @OneToOne(() => Hospital)
  @JoinColumn()
  hospital: Hospital;

  @OneToOne(() => Department)
  @JoinColumn()
  department: Department;

  @OneToOne(() => User, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
