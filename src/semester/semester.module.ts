import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Semester } from './entity/semester.entity';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';

@Module({
  imports: [TypeOrmModule.forFeature([Semester]), UserModule],
  controllers: [SemesterController],
  providers: [SemesterService],
  exports: [SemesterService],
})
export class SemesterModule {}
