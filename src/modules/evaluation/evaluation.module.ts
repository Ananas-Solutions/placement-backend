import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  StudentEvaluationEntity,
  SupervisorEvaluationEntity,
  TrainingSiteEvaluationEntity,
} from 'entities/index.entity';
import { QueuesModule } from 'queues/queues.module';
import { UserModule } from 'user/user.module';

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
