import { Authority } from 'src/authority/entity/authority.entity';
import { Department } from 'src/department/entity/department.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  location: any;

  @ManyToOne(() => Authority, (authority) => authority.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  authority: Authority;

  @OneToMany(() => Department, (department) => department.hospital, {
    cascade: true,
  })
  department: Department[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
