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

import { CustomBaseEntity } from './base.entity';
import { UserDocumentEntity } from './user-document.entity';
import { StudentProfileEntity } from './student-profile.entity';

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

  @Column({ nullable: true, default: '', unique: true })
  studentId?: string;

  @Column({ default: false })
  locked: boolean;

  @OneToMany(() => UserDocumentEntity, (userDocument) => userDocument.user)
  documents: UserDocumentEntity[];

  @OneToOne(() => StudentProfileEntity, (studentProfile) => studentProfile.user)
  studentProfile: StudentProfileEntity;
}
