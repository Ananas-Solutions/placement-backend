import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DocumentVerificationEnum } from 'commons/enums';

import { CourseEntity, CustomBaseEntity, UserEntity } from './index.entity';

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

  @Column({ default: 'global' })
  implication: string;

  @ManyToOne(() => UserEntity, (user) => user.documents, {
    cascade: ['soft-remove'],
    eager: false,
  })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => CourseEntity, { eager: false })
  @JoinColumn()
  course: CourseEntity;
}
