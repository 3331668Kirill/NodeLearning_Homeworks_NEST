import { BloggersCollection, BloggerType, PostsCollection } from '../db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BloggersRepository {
  constructor(
    private bloggersCollection: BloggersCollection,
    private postsCollection: PostsCollection,
  ) {}
  async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
    const filter = { name: { $regex: searchNameTerm ? searchNameTerm : '' } };
    const bloggers = await this.bloggersCollection.bloggersCollection
      .find(filter)
      .project({ _id: 0 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const totalCount =
      await this.bloggersCollection.bloggersCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: bloggers,
    };
  }
  async getBloggerById(bloggerId: string) {
    const blogger = await this.bloggersCollection.bloggersCollection.findOne({
      id: bloggerId,
    });
    if (blogger) {
      delete blogger._id;
      return blogger;
    } else return false;
  }
  async createBlogger(newBlogger: BloggerType) {
    await this.bloggersCollection.bloggersCollection.insertOne(newBlogger);
    return {
      id: newBlogger.id,
      name: newBlogger.name,
      youtubeUrl: newBlogger.youtubeUrl,
    };
  }
  async updateBloggerById(id: string, name: string, youtubeUrl: string) {
    const result = await this.bloggersCollection.bloggersCollection.updateOne(
      { id },
      {
        $set: {
          name: name,
          youtubeUrl: youtubeUrl,
        },
      },
    );
    await this.postsCollection.postsCollection.updateMany(
      { bloggerId: id },
      {
        $set: {
          bloggerName: name,
        },
      },
    );
    return result.modifiedCount === 1;
  }
  async deleteBloggerById(id: string): Promise<boolean> {
    const result = await this.bloggersCollection.bloggersCollection.deleteOne({
      id,
    });
    return result.deletedCount === 1;
  }
}
export const bloggersRepository = new BloggersRepository(
  new BloggersCollection(),
  new PostsCollection(),
);
