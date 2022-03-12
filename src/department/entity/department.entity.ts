import { Hospital } from 'src/hospital/entity/hospital.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
