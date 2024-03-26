import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blogs.name) private BlogsModel: Model<Blogs>) {}

  getAllBlogs(): Promise<Blogs[]> {
    return this.BlogsModel.find().exec();
  }

  getBlogById(blogId: string) {
    return this.BlogsModel.find({ _id: new ObjectId(blogId) });
  }
}
