import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorityEntity } from 'entities/index.entity';
import { UserModule } from 'user/user.module';

import { AuthorityController } from './authority.controller';
import { AuthorityService } from './authority.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorityEntity]), UserModule],
  controllers: [AuthorityController],
  providers: [AuthorityService],
  exports: [AuthorityService],
})
export class AuthorityModule {}
