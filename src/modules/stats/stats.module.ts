import { Module } from '@nestjs/common';

import { UserModule } from 'user/user.module';

import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [UserModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
