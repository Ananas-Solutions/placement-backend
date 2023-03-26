import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { CourseTrainingSiteEntity } from './course-training-site.entity';
import { CourseEntity } from './courses.entity';
import { UserEntity } from './user.entity';

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
