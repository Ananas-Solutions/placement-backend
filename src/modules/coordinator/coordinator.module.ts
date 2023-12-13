import { Module } from '@nestjs/common';

import { UserModule } from 'user/user.module';

import { CoordinatorController } from './coordinator.controller';
import { CoordinatorService } from './coordinator.service';

@Module({
  imports: [UserModule],
  controllers: [CoordinatorController],
  providers: [CoordinatorService],
})
export class CoordinatorModule {}
