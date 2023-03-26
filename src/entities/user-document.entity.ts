import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DocumentVerificationEnum } from 'commons/enums';

import { CustomBaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity()
export class UserDocumentEntity extends CustomBaseEntity {
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

  @ManyToOne(() => UserEntity, (user) => user.documents, {
    cascade: ['soft-remove'],
  })
  @JoinColumn()
  user: UserEntity;
}
