import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalModule } from 'src/hospital/hospital.module';
import { UserModule } from 'src/user/user.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Courses } from './entity/courses.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Courses]),UserModule,HospitalModule],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule {}
