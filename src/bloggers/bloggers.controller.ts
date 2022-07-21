import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { getPaginationData, PostType, QueryDataType } from '../db';
import { BloggersService } from './bloggers.service';
import { PostsService } from '../posts/posts.service';

@Controller('bloggers')
export class BloggersController {
  constructor(
    private bloggersService: BloggersService,
    private postsService: PostsService,
  ) {}

  @Get()
  async getBloggers(@Query() query: QueryDataType) {
    const { page, pageSize, searchNameTerm } = getPaginationData(query);
    const bloggers = await this.bloggersService.getBloggers(
      page,
      pageSize,
      searchNameTerm,
    );
    return bloggers;
  }

  @Post()
  async createBlogger(@Body() body: { name: string; youtubeUrl: string }) {
    const newBlogger = await this.bloggersService.createBlogger(
      body.name,
      body.youtubeUrl,
    );
    return newBlogger;
  }

  @Post(':bloggerId/posts')
  async createPost(
    @Param('bloggerId') bloggerId: string,
    @Body() body: PostType,
  ) {
    const newPost = await this.postsService.createPost({
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      bloggerId,
    });
    if (!newPost) {
      throw new NotFoundException();
    }
    return newPost;
  }

  @Get('/:bloggerId')
  async getBloggerById(@Param('bloggerId') bloggerId: string) {
    const blogger = await this.bloggersService.getBloggerById(bloggerId);
    if (blogger) {
      return blogger;
    } else {
      throw new NotFoundException({
        errorsMessages: [
          {
            message: 'blogger not found',
            field: 'id',
          },
        ],
        resultCode: 1,
      });
    }
  }

  @Put('/:bloggerId')
  @HttpCode(204)
  async changeBlogger(
    @Param('bloggerId') bloggerId: string,
    @Body() body: { name: string; youtubeUrl: string },
  ) {
    const blogger = await this.bloggersService.updateBloggerById(
      bloggerId,
      body.name,
      body.youtubeUrl,
    );
    if (!blogger) {
      throw new NotFoundException({
        errorsMessages: [
          {
            message: 'blogger not found',
            field: 'id',
          },
        ],
        resultCode: 0,
      });
    } else {
      return blogger;
    }
  }

  @Delete('/:bloggerId')
  @HttpCode(204)
  async deleteBlogger(@Param('bloggerId') bloggerId: string) {
    const isDeleted = await this.bloggersService.deleteBloggerById(bloggerId);
    if (isDeleted) {
      return isDeleted;
    } else {
      throw new NotFoundException({
        errorsMessages: [
          {
            message: 'blogger not found',
            field: 'id',
          },
        ],
        resultCode: 0,
      });
    }
  }
}
