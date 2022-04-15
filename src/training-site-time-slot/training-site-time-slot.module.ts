import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacementModule } from 'src/placement/placement.module';
import { TrainingSiteModule } from 'src/training-site/training-site.module';
import { UserModule } from 'src/user/user.module';
import { TrainingSiteTimeSlot } from './entity/training-site-time-slot.entity';
import { TrainingSiteTimeSlotController } from './training-site-time-slot.controller';
import { TrainingSiteTimeSlotService } from './training-site-time-slot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingSiteTimeSlot]),
    UserModule,
    TrainingSiteModule,
    PlacementModule,
  ],
  controllers: [TrainingSiteTimeSlotController],
  providers: [TrainingSiteTimeSlotService],
})
export class TrainingSiteTimeSlotModule {}
