import {
  BloggersRepository,
  bloggersRepository,
} from './bloggers-db-repository';
import { BloggerType } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BloggersService {
  constructor(private bloggersRepository: BloggersRepository) {}
  async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
    return await this.bloggersRepository.getBloggers(
      page,
      pageSize,
      searchNameTerm,
    );
  }
  async getBloggerById(id: string) {
    return await this.bloggersRepository.getBloggerById(id);
  }
  async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
    const bloggerToPush = {
      id: uuidv4(),
      //id: +(new Date()),
      name,
      youtubeUrl,
    };
    return await this.bloggersRepository.createBlogger(bloggerToPush);
  }
  async updateBloggerById(
    id: string,
    name: string,
    youtubeUrl: string,
  ): Promise<BloggerType | boolean> {
    const bloggerResult = await this.bloggersRepository.updateBloggerById(
      id,
      name,
      youtubeUrl,
    );
    return bloggerResult;
  }
  async deleteBloggerById(id: string): Promise<boolean> {
    return await this.bloggersRepository.deleteBloggerById(id);
  }
}
export const bloggersService = new BloggersService(bloggersRepository);
