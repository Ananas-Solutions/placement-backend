import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CustomBaseEntity, UserEntity } from './index.entity';

interface StudentKin {
  email?: string;
  name?: string;
}

@Entity()
export class StudentProfileEntity extends CustomBaseEntity {
  @Column()
  gender: string;

  @Column()
  dob: Date;

  @Column({ nullable: true })
  alternateEmail: string;

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

  @Column({ type: 'jsonb', nullable: true })
  kin: StudentKin;

  @Column({ nullable: true })
  identity: string;

  @OneToOne(() => UserEntity, { cascade: ['soft-remove'], eager: true })
  @JoinColumn()
  user: UserEntity;
}
