import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/domain/users.entity';

@Entity()
export class PasswordRecovery {
  @Column()
  recoveryCode: string;
  @Column()
  recoveryCodeExpireDate: Date;
  @Column()
  alreadyChangePassword: boolean;
  @CreateDateColumn({ type: 'time with time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'time with time zone' })
  updatedAt: Date;
  @OneToOne(() => Users, (user) => user.passwordRecovery)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @PrimaryColumn()
  userId: number;

  static createPasswordRecovery(userId: number) {
    const passwordRecovery = new PasswordRecovery();
    passwordRecovery.recoveryCode = randomUUID();
    passwordRecovery.recoveryCodeExpireDate = add(new Date(), {
      hours: 3,
      minutes: 3,
      seconds: 3,
    });
    passwordRecovery.alreadyChangePassword = false;
    passwordRecovery.userId = userId;
    return passwordRecovery;
  }
  // constructor(userId: string) {
  //   (this.userId = userId),
  //     (this.recoveryCode = randomUUID()),
  //     (this.recoveryCodeExpireDate = add(new Date(), {
  //       hours: 3,
  //       minutes: 3,
  //       seconds: 3,
  //     }));
  //   this.alreadyChangePassword = false;
  // }
}
