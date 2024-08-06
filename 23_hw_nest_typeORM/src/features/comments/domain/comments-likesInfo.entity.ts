import { LikesStatusComments } from '../api/models/input/comments-likesInfo.input.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from './comments.entity';

@Entity()
export class CommentsLikesInfo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
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
