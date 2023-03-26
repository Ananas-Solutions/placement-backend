import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { CourseTrainingSiteEntity } from './course-training-site.entity';
import { TrainingTimeSlotEntity } from './training-time-slot.entity';
import { UserEntity } from './user.entity';

@Entity()
export class PlacementEntity extends CustomBaseEntity {
  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  student: UserEntity;

  @ManyToOne(() => CourseTrainingSiteEntity, {
    cascade: ['soft-remove'],
  })
  @JoinColumn()
  trainingSite: CourseTrainingSiteEntity;

  @ManyToOne(() => TrainingTimeSlotEntity, {
    cascade: ['soft-remove'],
  })
  @JoinColumn()
  timeSlot: TrainingTimeSlotEntity;
}
