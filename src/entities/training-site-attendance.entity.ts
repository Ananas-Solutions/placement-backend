import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseTrainingSiteEntity } from './course-training-site.entity';
import { UserEntity } from './user.entity';

@Entity()
export class TrainingSiteAttendanceEntity extends CustomBaseEntity {
  @Column({ nullable: true })
  checkInDate!: string;

  @Column({ nullable: true })
  checkoutDate?: string;

  @ManyToOne(() => UserEntity, (student) => student.attendance, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student: UserEntity;

  @ManyToOne(
    () => CourseTrainingSiteEntity,
    (courseTrainingSite) => courseTrainingSite.attendance,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  courseTrainingSite: CourseTrainingSiteEntity;
}
