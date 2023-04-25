import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UserEntity } from 'entities/user.entity';
import { UserService } from 'user/user.service';

import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginDto): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(reqUser: Express.User) {
    try {
      const user = reqUser as UserEntity;
      const payload = {
        id: (user as UserEntity).id,
        name: user.name,
        role: user.role,
      };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      });
      return { accessToken: token, role: user.role, id: user.id };
    } catch (err) {
      throw err;
    }
  }
}
