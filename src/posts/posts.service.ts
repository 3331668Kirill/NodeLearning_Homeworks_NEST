import { Injectable } from '@nestjs/common';
import { PostType } from '../db';

@Injectable()
export class PostsService {
  constructor(private postsRepository: any) {}
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

  async createPost(newPostData: PostType): Promise<PostType | boolean> {
    const postToCreate = {
      ...newPostData,
      id: uuidv4(),
      //id: +(new Date()),
    };
    return await this.postsRepository.createPost(postToCreate);
  }
}
