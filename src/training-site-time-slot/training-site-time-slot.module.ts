import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingSiteModule } from 'src/training-site/training-site.module';
import { TrainingSiteTimeSlot } from './entity/training-site-time-slot.entity';
import { TrainingSiteTimeSlotController } from './training-site-time-slot.controller';
import { TrainingSiteTimeSlotService } from './training-site-time-slot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingSiteTimeSlot]),
    TrainingSiteModule,
  ],
  controllers: [TrainingSiteTimeSlotController],
  providers: [TrainingSiteTimeSlotService],
})
export class TrainingSiteTimeSlotModule {}
