import { Posts } from '../../posts/domain/posts.entity';
import { Users } from '../../users/domain/users.entity';
import { CommentsLikesInfo } from './comments-likesInfo.entity';
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

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.comments)
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  userId: number;

  @ManyToOne(() => Posts, (posts) => posts.comments)
  @JoinColumn({ name: 'postId' })
  post: Posts;
  @Column()
  postId: number;

  @OneToMany(
    () => CommentsLikesInfo,
    (commentsLikesInfo) => commentsLikesInfo.comment,
  )
  commentLikesInfo: CommentsLikesInfo[];

  static createComment(content: string, userId: number, postId: number) {
    const comment = new Comments();
    comment.content = content;
    comment.userId = userId;
    comment.postId = postId;
    return comment;
  }
}
