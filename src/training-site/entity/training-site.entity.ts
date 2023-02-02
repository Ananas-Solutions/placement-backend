import { Authority } from 'src/authority/entity/authority.entity';
import { Courses } from 'src/courses/entity/courses.entity';
import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { Department } from 'src/department/entity/department.entity';
import { Hospital } from 'src/hospital/entity/hospital.entity';
import { TrainingSiteTimeSlot } from 'src/training-site-time-slot/entity/training-site-time-slot.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TrainingSite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne(() => Authority, { onDelete: 'CASCADE' })
  authority: Authority;

  @ManyToOne(() => Hospital, { onDelete: 'CASCADE' })
  hospital: Hospital;

  @ManyToOne(() => Department, { onDelete: 'CASCADE' })
  department: Department;

  @ManyToOne(() => DepartmentUnits, { onDelete: 'CASCADE' })
  unit: DepartmentUnits;

  @ManyToOne(() => Courses, (course) => course.trainingSite, {
    onDelete: 'CASCADE',
  })
  course: Courses;

  @OneToMany(
    () => TrainingSiteTimeSlot,
    (trainingTimeSlots) => trainingTimeSlots.trainingSite,
    { cascade: true },
  )
  trainingTimeSlots: TrainingSiteTimeSlot[];

  @Column({ nullable: true })
  speciality: string;

  @Column({ type: 'jsonb', nullable: true })
  location: any;

  @Column()
  startsFrom: Date;

  @Column()
  endsAt: Date;
}
