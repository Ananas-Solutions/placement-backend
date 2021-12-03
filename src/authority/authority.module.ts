import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityController } from './authority.controller';
import { AuthorityService } from './authority.service';
import { Authority } from './entity/authority.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Authority])],
  controllers: [AuthorityController],
  providers: [AuthorityService],
  exports: [AuthorityService],
})
export class AuthorityModule {}
