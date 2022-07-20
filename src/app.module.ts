import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { BloggersService } from './bloggers/bloggers.service';
import { PostsRepository } from './posts/posts-db-repository';
import { BloggersRepository } from './bloggers/bloggers-db-repository';
import { BloggersCollection, PostsCollection } from './db';
import { CommentService } from './comments/comment.service';
import { CommentsRepository } from './comments/comments-db-repository';

@Module({
  imports: [],
  controllers: [AppController, PostsController],
  providers: [
    AppService,
    PostsService,
    BloggersService,
    PostsRepository,
    BloggersRepository,
    PostsCollection,
    BloggersCollection,
    CommentService,
    CommentsRepository,
  ],
})
export class AppModule {}
