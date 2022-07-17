import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { getPaginationData, PostType } from '../db';

interface TypeQueryGetPosts {
  page: number;
  pageSize: number;
  searchNameTerm: string;
}

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@Query() query: TypeQueryGetPosts) {
    const { page, pageSize, searchNameTerm } = getPaginationData(query);
    return await this.postsService.getPosts(
      page,
      pageSize,
      searchNameTerm,
      null,
    );
  }

  @Post()
  async createPosts(@Body() body: PostType) {
    const bloggerId: string | number = body.bloggerId;
    //const blogger = await bloggersService.getBloggerById(bloggerId)

    const newPost = await this.postsService.createPost({
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      bloggerId,
    });

    return newPost;
  }
}
