import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Blogs } from '../../blogs/domain/blogs.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  shortDescription: string;
  @Column()
  content: string;
  @CreateDateColumn({ type: 'time with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'time with time zone' })
  updatedAt: Date;

  @ManyToOne(() => Blogs, (blogs) => blogs.posts)
  @JoinColumn({ name: 'blogId' })
  blog: Blogs;

  @Column()
  blogId: number;

  static createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: number,
  ) {
    const posts = new Posts();
    posts.title = title;
    posts.shortDescription = shortDescription;
    posts.content = content;
    posts.blogId = blogId;
    return posts;
  }
}

// @Entity()
// export class Posts {
//   @PrimaryGeneratedColumn()
//   id: number;
//   @Column()
//   title: string;
//   @Column()
//   shortDescription: string;
//   @Column()
//   content: string;
//   @CreateDateColumn({ type: 'time with time zone' })
//   createdAt: Date;
//   @UpdateDateColumn({ type: 'time with time zone' })
//   updatedAt: Date;
// }
