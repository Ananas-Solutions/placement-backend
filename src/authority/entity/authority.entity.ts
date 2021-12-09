import { Hospital } from 'src/hospital/entity/hospital.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Authority {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  initials: string;

  @Column()
  name: string;

  @OneToMany(() => Hospital, (hospital) => hospital.authority, {
    cascade: true,
  })
  hospital: Hospital[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
