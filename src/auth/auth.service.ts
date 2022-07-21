import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/user-db-repository';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async checkCredentials(login: string, password: string) {
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
      const token = jwt.sign({ userId: user.id }, 'topSecretKey', {
        expiresIn: '30d',
      });
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
