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
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { ApiTags } from '@nestjs/swagger';
import { AuthorityService } from './authority.service';
import { CreateAuthorityDto, UpdateAuthorityDto } from './dto/authority.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('authority')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.ADMIN)
@Controller('authority')
export class AuthorityController {
  constructor(private authorityService: AuthorityService) {}

  @Post()
  async createAuthority(@Body() body: CreateAuthorityDto): Promise<any> {
    return this.authorityService.saveAuthority(body);
  }

  @Get()
  async queryAllAuthority(): Promise<any> {
    return this.authorityService.findAllAuthority();
  }

  @Get(':id')
  async queryOneAuthority(@Param() { id }: { id: string }): Promise<any> {
    return this.authorityService.findOneAuthority(id);
  }

  @Put()
  async updateAuthority(@Body() body: UpdateAuthorityDto): Promise<any> {
    return this.authorityService.updateOneAuthority(body);
  }

  @Delete(':id')
  async deleteAuthority(@Param() id: string): Promise<any> {
    return this.authorityService.deleteOneAuthority(id);
  }
}
