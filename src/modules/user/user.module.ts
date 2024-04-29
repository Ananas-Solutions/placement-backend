import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentProfileEntity } from 'entities/index.entity';
import { UserEntity } from 'entities/user.entity';
import { EmailService } from 'helper/send-email.service';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, StudentProfileEntity])],
  controllers: [UserController],
  providers: [UserService, EmailService],
  exports: [UserService],
})
export class UserModule {}
