import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { StudentProfile } from 'src/student/entity/student-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, StudentProfile])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
