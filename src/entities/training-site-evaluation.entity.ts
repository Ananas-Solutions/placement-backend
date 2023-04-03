import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  CourseEntity,
  CourseTrainingSiteEntity,
  CustomBaseEntity,
  UserEntity,
} from './index.entity';

@Entity()
export class TrainingSiteEvaluationEntity extends CustomBaseEntity {
  @Column({ type: 'jsonb' })
  evaluation: any;

  @ManyToOne(() => UserEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  evaluator: UserEntity;

  @ManyToOne(() => CourseTrainingSiteEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  trainingSite: CourseTrainingSiteEntity;

  @ManyToOne(() => CourseEntity, { cascade: ['soft-remove'] })
  @JoinColumn()
  course: CourseEntity;
}
