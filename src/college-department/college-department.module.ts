import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollegeDepartmentController } from './college-department.controller';
import { CollegeDepartmentService } from './college-department.service';
import { CollegeDepartent } from './entity/college-department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollegeDepartent])],
  controllers: [CollegeDepartmentController],
  providers: [CollegeDepartmentService],
  exports: [CollegeDepartmentService],
})
export class CollegeDepartmentModule {}
