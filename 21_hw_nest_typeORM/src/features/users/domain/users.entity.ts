import { UserInputModelType } from '../api/models/input/create-users.input.model';
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
import { Posts } from 'src/features/posts/domain/posts.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  login: string;
  @Column()
  passwordSalt: string;
  @Column()
  passwordHash: string;
  @CreateDateColumn({ type: 'time with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'time with time zone' })
  updatedAt: Date;

  @OneToOne(() => EmailConfirmation, (e) => e.user)
  emailConfirmation: EmailConfirmation;

  // @OneToMany(() => Posts, (posts) => posts.user)
  // posts: Posts[];

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
