import { Authority } from 'src/authority/entity/authority.entity';
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

  @Column()
  name: string;

  @Column()
  address: string;

  @ManyToOne(() => Authority, { onDelete: 'CASCADE' })
  authority: Authority;

  @ManyToOne(() => Hospital, { onDelete: 'CASCADE' })
  hospital: Hospital;

  @ManyToOne(() => Department, { onDelete: 'CASCADE' })
  department: Department;

  @OneToMany(
    () => TrainingSiteTimeSlot,
    (trainingTimeSlots) => trainingTimeSlots.trainingSite,
    { cascade: true },
  )
  trainingTimeSlots: TrainingSiteTimeSlot[];

  @Column()
  speciality: string;

  @Column({ type: 'jsonb' })
  location: any;
}