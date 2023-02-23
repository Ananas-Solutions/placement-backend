import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TrainingTimeSlot } from 'src/training-time-slot/entity/training-time-slot.entity';
import { User } from 'src/user/entity/user.entity';
import { CourseTrainingSite } from 'src/courses/entity/course-training-site.entity';

@Entity()
export class Placement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  student: User;

  @ManyToOne(() => CourseTrainingSite, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  trainingSite: CourseTrainingSite;

  @ManyToOne(() => TrainingTimeSlot, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  timeSlot: TrainingTimeSlot;
}
