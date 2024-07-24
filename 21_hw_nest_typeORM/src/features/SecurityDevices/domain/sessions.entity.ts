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

@Entity()
export class Sessions {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  deviceId: string;
  @Column()
  ip: string;
  @Column()
  deviceName: string;

  userId: string;
  @CreateDateColumn({ type: 'time with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'time with time zone' })
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: Users;
}
