import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserRoleEnum } from 'commons/enums';
import {
  CustomBaseEntity,
  StudentProfileEntity,
  UserDocumentEntity,
} from './index.entity';

@Entity()
export class UserEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.ADMIN })
  role: UserRoleEnum;

  @Index()
  @Column({ nullable: true, default: '' })
  studentId?: string;

  @Column({ default: false })
  locked: boolean;

  @Column({ default: false })
  isFirstLogin: boolean;

  @OneToMany(() => UserDocumentEntity, (userDocument) => userDocument.user, {
    cascade: ['update', 'soft-remove'],
    eager: true,
  })
  documents: UserDocumentEntity[];

  @OneToOne(
    () => StudentProfileEntity,
    (studentProfile) => studentProfile.user,
    {
      cascade: ['update', 'soft-remove'],
    },
  )
  studentProfile: StudentProfileEntity;
}
