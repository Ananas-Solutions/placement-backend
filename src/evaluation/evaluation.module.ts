import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueuesModule } from 'src/queues/queues.module';
import { UserModule } from 'src/user/user.module';
import { DepartmentUnitEvaluation } from './entity/department-unit-evaluation.entity';
import { StudentEvaluation } from './entity/student-evaluation.entity';
import { SupervisorEvaluation } from './entity/supervisor-evaluation.entity';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DepartmentUnitEvaluation,
      StudentEvaluation,
      SupervisorEvaluation,
    ]),
    UserModule,
    QueuesModule,
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}