import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentService) {}

  @Get(':commentId')
  async getComments(@Param('commentId') commentId: string) {
    const comment = await this.commentsService.getCommentById(commentId);
    if (comment) {
      return comment;
    } else {
      throw new NotFoundException();
    }
  }

  @Put(':commentId')
  @HttpCode(204)
  async changeComment(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
  ) {
    const updated = await this.commentsService.updateCommentById(
      commentId,
      content,
    );

    if (updated) {
      return updated;
    } else {
      throw new NotFoundException();
    }
  }

  @Delete(':commentId')
  async deleteComments(@Param('commentId') commentId: string) {
    const result = await this.commentsService.deleteComment(commentId);
    if (result) {
      return result;
    } else {
      throw new NotFoundException();
    }
  }
}
