import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user-db-repository';
import { UserType } from '../db';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private authService: AuthService,
  ) {}

  async getUsers(page: number, pageSize: number, searchNameTerm: string) {
    const users = await this.usersRepository.getUsers(
      page,
      pageSize,
      searchNameTerm,
    );
    return users;
  }
  async createUser(login: string, password: string): Promise<UserType> {
    const passwordHash = await this.authService._generateHash(password);
    const newUser = {
      id: uuidv4(),
      login,
      passwordHash,
    };
    const createdUser = await this.usersRepository.createUser(newUser);
    return createdUser;
  }
  async deleteUserById(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(id);
  }
}
