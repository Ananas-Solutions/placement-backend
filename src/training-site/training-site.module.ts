import { Module } from '@nestjs/common';
import { TrainingSiteController } from './training-site.controller';
import { TrainingSiteService } from './training-site.service';

@Module({
  controllers: [TrainingSiteController],
  providers: [TrainingSiteService],
  exports: [TrainingSiteService],
})
export class TrainingSiteModule {}
