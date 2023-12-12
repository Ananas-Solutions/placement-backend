import { Module } from '@nestjs/common';

import { UserModule } from 'user/user.module';

import { AuthorityController } from './authority.controller';
import { AuthorityService } from './authority.service';

@Module({
  imports: [UserModule],
  controllers: [AuthorityController],
  providers: [AuthorityService],
  exports: [AuthorityService],
})
export class AuthorityModule {}
