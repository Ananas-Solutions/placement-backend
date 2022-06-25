import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column({ nullable: true })
  alternameEmail: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  alternatePhone: string;

  @Column()
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'jsonb' })
  kin: JSON;

  @Column({ nullable: true })
  identity: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
