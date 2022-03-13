import { TrainingSiteTimeSlot } from 'src/training-site-time-slot/entity/training-site-time-slot.entity';
import { TrainingSite } from 'src/training-site/entity/training-site.entity';
import { User } from 'src/user/entity/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Placement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  student: User;

  @ManyToOne(() => TrainingSite, { cascade: true, onDelete: 'CASCADE' })
  trainingSite: TrainingSite;

  @ManyToOne(() => TrainingSiteTimeSlot, { cascade: true, onDelete: 'CASCADE' })
  timeSlot: TrainingSiteTimeSlot;
}
