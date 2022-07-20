import { Injectable } from '@nestjs/common';
import { PostType } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { PostsRepository } from './posts-db-repository';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}
  async getPosts(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    bloggerId: string | null | number,
  ) {
    const postsToSend = await this.postsRepository.getPosts(
      page,
      pageSize,
      searchNameTerm,
      bloggerId,
    );
    return postsToSend;
  }

  async createPost(newPostData: PostType) {
    const postToCreate = {
      ...newPostData,
      id: uuidv4(),
      //id: +(new Date()),
    };
    return await this.postsRepository.createPost(postToCreate);
  }

  async getPostById(id: string): Promise<PostType | false> {
    const post = await this.postsRepository.getPostById(id);
    if (post) {
      return post;
    } else return false;
  }

  async updatePostById(id: string, newPost: PostType) {
    return await this.postsRepository.updatePostById({
      id,
      ...newPost,
    });
  }

  async deletePostById(id: string): Promise<boolean> {
    return await this.postsRepository.deletePostById(id);
  }
}
