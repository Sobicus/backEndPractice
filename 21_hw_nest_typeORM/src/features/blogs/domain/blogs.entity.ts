import { BlogInputModelType } from '../api/models/input/create-blog.input.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from '../../posts/domain/posts.entity';

@Entity()
export class Blogs {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  websiteUrl: string;
  @Column()
  isMembership: boolean;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => Posts, (posts) => posts.blog)
  posts: Posts[];

  static create({ name, websiteUrl, description }: BlogInputModelType) {
    const blog = new Blogs();
    blog.name = name;
    blog.websiteUrl = websiteUrl;
    blog.description = description;
    blog.isMembership = false;
    return blog;
  }
}
