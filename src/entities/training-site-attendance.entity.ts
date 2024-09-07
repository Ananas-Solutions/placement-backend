import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseTrainingSiteEntity } from './course-training-site.entity';
import { UserEntity } from './user.entity';

@Entity()
export class TrainingSiteAttendanceEntity extends CustomBaseEntity {
  @Column({ nullable: true })
  checkInDate!: Date;

  @Column({ nullable: true })
  checkoutDate?: Date;

  @ManyToOne(() => UserEntity, (student) => student.attendance, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  student: UserEntity;

  // @ManyToOne(
  //   () => CourseTrainingSiteEntity,
  //   (courseTrainingSite) => courseTrainingSite.attendance,
  //   { onDelete: 'CASCADE' },
  // )
  // @JoinColumn()

  @Column({ nullable: true })
  trainingSite: string;
}
