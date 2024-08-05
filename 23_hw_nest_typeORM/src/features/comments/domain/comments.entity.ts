import { Posts } from 'src/features/posts/domain/posts.entity';
import { Users } from 'src/features/users/domain/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  static createComment(content: string, userId: number, postId: number) {
    const comment = new Comments();
    comment.content = content;
    comment.userId = userId;
    comment.postId = postId;
    return comment;
  }
}
