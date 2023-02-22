import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

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
      const { password, ...modifiedUser } = user;
      return modifiedUser;
    }
    return null;
  }

  async login(reqUser: Express.User) {
    try {
      const user = reqUser as User;
      const payload = {
        id: (user as User).id,
        name: user.name,
        role: user.role,
      };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      });
      return { accessToken: token, role: user.role };
    } catch (err) {
      throw err;
    }
  }
}
