import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { ApiTags } from '@nestjs/swagger';
import { AuthorityService } from './authority.service';
import { CreateAuthorityDto, UpdateAuthorityDto } from './dto/authority.dto';

@ApiTags('authority')
@UseInterceptors(ErrorInterceptor)
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
