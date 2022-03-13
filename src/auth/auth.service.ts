import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';
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
      const { password, ...modifiedUser } = user;
      return modifiedUser;
    }
    return null;
  }

  async login(user: Express.User, res: Response) {
    try {
      const payload = { id: (user as User).id };
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SIGN_SECRET,
        expiresIn: '1d',
      });
      // res.cookie('accessToken', token, {
      //   expires: new Date(Date.now() + 86400000), // expires after 1 day
      //   // httpOnly: true, // for extra layer of security
      // });
      return res.send({ ...user, accessToken: token });
    } catch (err) {
      throw err;
    }
  }
}
