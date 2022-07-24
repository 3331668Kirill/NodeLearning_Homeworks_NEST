import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/user-db-repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async checkCredentials(login: string, password: string) {
    debugger;
    const user = await this.usersRepository.findUserByLogin(login);
    if (!user)
      return {
        resultCode: 1,
        data: {
          token: null,
        },
      };
    const isHashesEquals = await this._isPasswordCorrect(
      password,
      user.passwordHash,
    );
    if (isHashesEquals) {
      //const token = jwt.sign({ userId: user.id }, 'topSecretKey', {
      const token = this.jwtService.sign(
        { userId: user.id },
        { secret: 'topSecretKey' },
      );
      return {
        resultCode: 0,
        data: {
          token: token,
        },
      };
    } else {
      return {
        resultCode: 1,
        data: {
          token: null,
        },
      };
    }
  }
  async _generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  async _isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }
}
