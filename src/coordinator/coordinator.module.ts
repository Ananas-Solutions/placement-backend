import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from 'src/courses/entity/courses.entity';
import { UserModule } from 'src/user/user.module';
import { CoordinatorController } from './coordinator.controller';
import { CoordinatorService } from './coordinator.service';
import { CoordinatorProfile } from './entity/coordinator-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoordinatorProfile, Courses]),
    UserModule,
  ],
  controllers: [CoordinatorController],
  providers: [CoordinatorService],
})
export class CoordinatorModule {}
