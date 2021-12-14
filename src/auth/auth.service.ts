import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
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

  async login(user: any, response: Response) {
    const payload = { id: user.id };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }
}
