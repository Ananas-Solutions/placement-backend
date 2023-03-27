import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserRoleEnum } from 'commons/enums';
import { Roles } from 'commons/decorator';
import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { ErrorInterceptor } from 'interceptor/index';

import { AuthorityService } from './authority.service';
import { AuthorityDto } from './dto';

@ApiTags('authority')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
@Controller('authority')
export class AuthorityController {
  constructor(private authorityService: AuthorityService) {}

  @Post()
  async createAuthority(@Body() body: AuthorityDto) {
    return this.authorityService.saveAuthority(body);
  }

  @Get()
  async queryAllAuthority() {
    return this.authorityService.findAllAuthority();
  }

  @Get(':id')
  async queryOneAuthority(@Param('id') id: string) {
    return this.authorityService.findOneAuthority(id);
  }

  @Put(':id')
  async updateAuthority(@Param('id') id: string, @Body() body: AuthorityDto) {
    return this.authorityService.updateOneAuthority(id, body);
  }

  @Delete(':id')
  async deleteAuthority(@Param('id') id: string) {
    return this.authorityService.deleteOneAuthority(id);
  }
}
