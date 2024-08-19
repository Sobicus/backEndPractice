import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LikesStatusComments } from '../api/models/input/comments-likesInfo.input.model';
import { Comments } from './comments.entity';
import { Users } from '../../users/domain/users.entity';

@Entity()
export class CommentsLikesInfo {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
  @Column()
  myStatus: LikesStatusComments;

  @ManyToOne(() => Comments, (comments) => comments.commentLikesInfo)
  @JoinColumn({ name: 'commentId' })
  comment: Comments;
  @Column()
  commentId: number;

  @ManyToOne(() => Users, (users) => users.commentsLikesInfo)
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  userId: number;

  static createCommentLikesInfo(
    userId: number,
    commentId: number,
    myStatus: LikesStatusComments,
  ) {
    const commentLikesInfo = new CommentsLikesInfo();
    commentLikesInfo.userId = userId;
    commentLikesInfo.commentId = commentId;
    commentLikesInfo.myStatus = myStatus;
    return commentLikesInfo;
  }
}
