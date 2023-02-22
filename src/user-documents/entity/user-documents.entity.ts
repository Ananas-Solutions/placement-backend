import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DocumentVerificationEnum } from '../types/document-verification.type';

@Entity()
export class UserDocuments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: DocumentVerificationEnum,
    default: DocumentVerificationEnum.PENDING,
  })
  status: DocumentVerificationEnum;

  @Column({ nullable: true })
  comments: string;

  @Column({ type: 'date', nullable: true })
  documentExpiryDate: Date;

  @ManyToOne(() => User, (user) => user.documents, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
