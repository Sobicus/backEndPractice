import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Blogs } from '../../blogs/domain/blogs.entity';
import { Comments } from 'src/features/comments/domain/comments.entity';
import { PostsLikesInfo } from './posts-likesInfo.entity';

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
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => Blogs, (blogs) => blogs.posts)
  @JoinColumn({ name: 'blogId' })
  blog: Blogs;

  @Column()
  blogId: number;

  @OneToMany(() => Comments, (comments) => comments.post)
  comments: Comments[];

  @OneToMany(() => PostsLikesInfo, (postsLikesInfo) => postsLikesInfo.post)
  postsLikesInfo: PostsLikesInfo[];

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
