import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department.entity';

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @OneToMany(() => Department, (department) => department.hospital, {
    cascade: true,
  })
  department: Department;
}
