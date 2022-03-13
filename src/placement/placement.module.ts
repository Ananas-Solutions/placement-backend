import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Placement } from './entity/placement.entity';
import { PlacementController } from './placement.controller';
import { PlacementService } from './placement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Placement]), UserModule],
  controllers: [PlacementController],
  providers: [PlacementService],
})
export class PlacementModule {}
