import { LikesStatusPosts } from '../api/models/input/posts-likesInfo.input.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from './posts.entity';
import { Users } from '../../users/domain/users.entity';

@Entity()
export class PostsLikesInfo {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
  @Column()
  myStatus: LikesStatusPosts;

  @ManyToOne(() => Posts, (posts) => posts.postsLikesInfo)
  @JoinColumn({ name: 'postId' })
  post: Posts;
  @Column()
  postId: number;

  @ManyToOne(() => Users, (users) => users.postsLikesInfo)
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  userId: number;

  static createPostLikesinfo(
    userId: number,
    postId: number,
    myStatus: LikesStatusPosts,
  ) {
    const postLikesInfo = new PostsLikesInfo();
    postLikesInfo.userId = userId;
    postLikesInfo.postId = postId;
    postLikesInfo.myStatus = myStatus;
    return postLikesInfo;
  }
}
