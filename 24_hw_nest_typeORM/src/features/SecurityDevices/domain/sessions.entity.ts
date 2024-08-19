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
  @Column()
  issuedAt: string;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  userId: number;
  static createSession(
    deviceId: string,
    ip: string,
    deviceName: string,
    userId: number,
    issuedAt: string,
  ) {
    const session = new Sessions();
    session.deviceId = deviceId;
    session.ip = ip;
    session.deviceName = deviceName;
    session.userId = userId;
    session.issuedAt = issuedAt;
    return session;
  }
}
