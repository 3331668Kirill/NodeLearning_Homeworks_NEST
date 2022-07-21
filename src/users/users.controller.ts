import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { getPaginationData, QueryDataType } from '../db';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: QueryDataType) {
    const { page, pageSize, searchNameTerm } = getPaginationData(query);
    const users = await this.usersService.getUsers(
      page,
      pageSize,
      searchNameTerm,
    );
    return users;
  }

  @Post()
  async createUser(@Body() body: { login: string; password: string }) {
    const createdUser = await this.usersService.createUser(
      body.login,
      body.password,
    );
    return createdUser;
  }

  @Delete(':userId')
  @HttpCode(204)
  async deleteUser(@Param('userId') userId: string) {
    const isDeleted = await this.usersService.deleteUserById(userId);
    if (isDeleted) {
      return isDeleted;
    } else {
      throw new NotFoundException();
    }
  }
}
