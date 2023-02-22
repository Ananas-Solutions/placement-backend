import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacementModule } from 'src/placement/placement.module';
import { UserModule } from 'src/user/user.module';
import { TrainingTimeSlot } from './entity/training-time-slot.entity';
import { TrainingSiteTimeSlotController } from './training-time-slot.controller';
import { TrainingSiteTimeSlotService } from './training-time-slot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingTimeSlot]),
    UserModule,
    PlacementModule,
  ],
  controllers: [TrainingSiteTimeSlotController],
  providers: [TrainingSiteTimeSlotService],
})
export class TrainingSiteTimeSlotModule {}
