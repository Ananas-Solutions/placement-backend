import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import {
  CourseTrainingSiteEntity,
  CustomBaseEntity,
  PlacementEntity,
  SupervisorEvaluationEntity,
  TrainingSiteEvaluationEntity,
  UserEntity,
} from './index.entity';

@Entity()
export class TrainingTimeSlotEntity extends CustomBaseEntity {
  @Column({ type: 'jsonb' })
  day: string[];

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  capacity: number;

  @ManyToOne(
    () => CourseTrainingSiteEntity,
    (trainingSite) => trainingSite.timeslots,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  trainingSite: CourseTrainingSiteEntity;

  @OneToMany(() => PlacementEntity, (placement) => placement.timeSlot, {
    cascade: true,
  })
  placements: PlacementEntity[];

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  supervisor: UserEntity;

  @OneToMany(
    () => SupervisorEvaluationEntity,
    (supervisorEvaluation) => supervisorEvaluation.timeslot,
    {
      cascade: true,
    },
  )
  supervisorEvaluation: SupervisorEvaluationEntity[];

  @OneToMany(
    () => TrainingSiteEvaluationEntity,
    (trainingSiteEvaluation) => trainingSiteEvaluation.timeslot,
    {
      cascade: true,
    },
  )
  trainingSiteEvaluation: TrainingSiteEvaluationEntity[];
}
