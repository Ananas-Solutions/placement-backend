import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hospital } from './hospital.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @JoinColumn()
  @ManyToOne(() => Hospital, (hospital) => hospital.department, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  hospital: Hospital;
}
