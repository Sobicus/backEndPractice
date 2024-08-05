import { LikesStatusComments } from '../api/models/input/comments-likesInfo.input.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from './comments.entity';

@Entity()
export class CommentsLikesInfo {
  @Column()
  userId: number;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
  @Column()
  myStatus: LikesStatusComments;
  @OneToOne(() => Comments, (comments) => comments.commentLikesInfo)
  @JoinColumn({ name: 'commentId' })
  comment: Comments;
  @PrimaryColumn()
  commentId: number;
}
