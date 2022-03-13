import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { TrainingSite } from './entity/training-site.entity';
import { TrainingSiteController } from './training-site.controller';
import { TrainingSiteService } from './training-site.service';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingSite]), UserModule],
  controllers: [TrainingSiteController],
  providers: [TrainingSiteService],
  exports: [TrainingSiteService],
})
export class TrainingSiteModule {}
