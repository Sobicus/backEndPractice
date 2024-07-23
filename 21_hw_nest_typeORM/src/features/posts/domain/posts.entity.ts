import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/domain/users.entity';

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
//
//   @ManyToOne(() => Users, (user) => user.posts)
//   @JoinColumn({ name: 'userId' })
//   user: Users;
//
//   @Column()
//   userId: number;
// }

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
}
