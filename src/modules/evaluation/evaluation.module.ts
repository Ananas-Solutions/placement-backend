import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueuesModule } from 'queues/queues.module';
import { UserModule } from 'user/user.module';
import { StudentEvaluationEntity } from 'entities/student-evaluation.entity';
import { SupervisorEvaluationEntity } from 'entities/supervisor-evaluation.entity';
import { TrainingSiteEvaluationEntity } from 'entities/training-site-evaluation.entity';

import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrainingSiteEvaluationEntity,
      StudentEvaluationEntity,
      SupervisorEvaluationEntity,
    ]),
    UserModule,
    QueuesModule,
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
