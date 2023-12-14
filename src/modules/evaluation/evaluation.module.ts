import { Module } from '@nestjs/common';

import { QueuesModule } from 'queues/queues.module';
import { UserModule } from 'user/user.module';

import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports: [UserModule, QueuesModule],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
