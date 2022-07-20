import { QueryDataType, UserType } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments-db-repository';

@Injectable()
export class CommentService {
  constructor(private commentsRepository: CommentsRepository) {}

  async getComments(
    paginationData: QueryDataType,
    PostId: string | null | number,
  ) {
    const comments = await this.commentsRepository.getComments(
      paginationData,
      PostId,
    );
    return comments;
  }
  async getCommentById(commentId: string) {
    const result = await this.commentsRepository.getCommentById(commentId);
    return result;
  }
  async updateCommentById(commentId: string, content: string) {
    const comment = await this.commentsRepository.updateComment(
      commentId,
      content,
    );
    return comment;
  }
  async createComment(
    paginationData: QueryDataType,
    content: string,
    postId: string,
    userLogin: string,
    userId: string,
  ) {
    const newComment = {
      id: uuidv4(),
      content,
      userId,
      postId,
      userLogin,
      addedAt: new Date(),
    };
    const result = await this.commentsRepository.createComment(newComment);
    return result;
  }
  async deleteComment(id: string): Promise<boolean> {
    return await this.commentsRepository.deleteComment(id);
  }
}
