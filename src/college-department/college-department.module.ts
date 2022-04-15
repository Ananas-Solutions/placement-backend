import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { CollegeDepartmentController } from './college-department.controller';
import { CollegeDepartmentService } from './college-department.service';
import { CollegeDepartment } from './entity/college-department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollegeDepartment]), UserModule],
  controllers: [CollegeDepartmentController],
  providers: [CollegeDepartmentService],
  exports: [CollegeDepartmentService],
})
export class CollegeDepartmentModule {}
