import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { BloggersController } from './bloggers/bloggers.controller';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/user-db-repository';
import { CommentsController } from './comments/comments.controller';
import { authMiddleware } from './middlewares/auth-middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [
    AppController,
    PostsController,
    AuthController,
    UsersController,
    BloggersController,
    CommentsController,
  ],
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
    AuthService,
    UsersService,
    UsersRepository,
    JwtService,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(authMiddleware)
  //     .exclude({ path: 'comments/(.*)', method: RequestMethod.GET })
  //     .forRoutes(CommentsController, {
  //       path: 'posts',
  //       method: RequestMethod.POST,
  //     });
  // }
}
