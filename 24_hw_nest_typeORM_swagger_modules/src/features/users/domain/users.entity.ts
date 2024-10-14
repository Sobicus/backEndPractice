import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmailConfirmation } from './emailConfirmation.entity';
import { Sessions } from '../../SecurityDevices/domain/sessions.entity';
import { PasswordRecovery } from '../../auth/domain/passwordRecovery.entity';
import { Comments } from '../../comments/domain/comments.entity';
import { CommentsLikesInfo } from '../../comments/domain/comments-likesInfo.entity';
import { PostsLikesInfo } from '../../posts/domain/posts-likesInfo.entity';
import { UserInputModelType } from '../api/models/input/create-users.input.model';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column({ collation: 'C' })
  login: string;
  @Column()
  passwordSalt: string;
  @Column()
  passwordHash: string;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToOne(() => EmailConfirmation, (e) => e.user)
  emailConfirmation: EmailConfirmation;

  @OneToMany(() => Sessions, (sessions) => sessions.user)
  sessions: Sessions[];

  @OneToOne(() => PasswordRecovery, (passwordRecovery) => passwordRecovery.user)
  passwordRecovery: PasswordRecovery;

  @OneToMany(() => Comments, (comments) => comments.user)
  comments: Comments[];

  @OneToMany(() => Comments, (comments) => comments.user)
  commentsLikesInfo: CommentsLikesInfo[];

  @OneToMany(() => PostsLikesInfo, (postsLikesInfo) => postsLikesInfo.user)
  postsLikesInfo: PostsLikesInfo[];

  static createUser(
    inputModel: UserInputModelType,
    passwordSalt: string,
    passwordHash: string,
  ) {
    const user = new Users();
    user.login = inputModel.login;
    user.email = inputModel.email;
    user.passwordSalt = passwordSalt;
    user.passwordHash = passwordHash;
    return user;
  }
}
