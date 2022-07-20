import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { getPaginationData, PostType } from '../db';
import { BloggersService } from '../bloggers/bloggers.service';
import { CommentService } from '../comments/comment.service';
import { Response } from 'express';

interface TypeQueryGetPosts {
  page: number;
  pageSize: number;
  searchNameTerm: string;
}

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private bloggersService: BloggersService,
    private commentsService: CommentService,
  ) {}

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
  @HttpCode(204)
  async createPosts(
    @Res({ passthrough: true }) res: Response,
    @Body() body: PostType,
  ) {
    const bloggerId: string = body.bloggerId;
    const blogger = await this.bloggersService.getBloggerById(bloggerId);
    if (!blogger) {
      res.status(400).send({
        errorsMessages: [
          {
            message: 'blogger not found',
            field: 'bloggerId',
          },
        ],
        // "resultCode": 1
      });
    }
    const newPost = await this.postsService.createPost({
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      bloggerId,
    });

    return newPost;
  }

  @Get(':postId')
  async getPostById(
    @Res({ passthrough: true }) res: Response,
    @Param('postId') postId: string,
  ) {
    const returnedPost = await this.postsService.getPostById(postId);
    if (!returnedPost) {
      res.status(404).send({
        errorsMessages: [
          {
            message: 'post not found',
            field: 'id',
          },
        ],
        resultCode: 1,
      });
    }
    return returnedPost;
  }

  @Put(':postId')
  @HttpCode(204)
  async changePost(
    @Res({ passthrough: true }) res: Response,
    @Param('postId') postId: string,
    @Body() body: PostType,
  ) {
    const id = postId;
    const updatePost: PostType = {
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      bloggerId: body.bloggerId,
    };
    const bloggerToUpdate = await this.bloggersService.getBloggerById(
      updatePost.bloggerId,
    );
    if (!bloggerToUpdate) {
      res.status(400).send({
        errorsMessages: [
          {
            message: 'blogger not found',
            field: 'bloggerId',
          },
        ],
      });
    }
    const updatedPost = await this.postsService.updatePostById(id, updatePost);
    if (!updatedPost) {
      res.status(404);
      res.send({
        errorsMessages: [
          {
            message: 'post not found',
            field: 'id',
          },
        ],
        resultCode: 0,
      });
    }

    return updatedPost;
  }

  @Delete(':postId')
  @HttpCode(204)
  async deletePost(@Param('postId') postId: string) {
    const id = postId;
    const isDeleted = await this.postsService.deletePostById(id);
    if (!isDeleted) {
      throw new NotFoundException();
    }
    return isDeleted;
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Res({ passthrough: true }) res: Response,
    @Param('postId') postId: string,
    @Query() query: TypeQueryGetPosts,
  ) {
    const id = postId;
    const paginationData = getPaginationData(query);
    const comments = await this.commentsService.getComments(paginationData, id);
    const post = await this.postsService.getPostById(id);
    if (!post) {
      res.status(404);
    }
    return comments;
  }

  @Post(':postId/comments')
  @HttpCode(201)
  async createCommentByPostId(
    @Res({ passthrough: true }) res: Response,
    @Param('postId') postId: string,
    @Query() query: TypeQueryGetPosts,
    @Body() body: PostType,
  ) {
    const paginationData = getPaginationData(query);
    //const userLogin = user!.login
    //const userId = user!.id
    const content = body.content;
    const post = await this.postsService.getPostById(postId);
    const comments = await this.commentsService.createComment(
      paginationData,
      content,
      postId,
      '', //userLogin,
      '', //userId!
    );
    if (!post) {
      res.status(404);
    }

    return comments;
  }
}
