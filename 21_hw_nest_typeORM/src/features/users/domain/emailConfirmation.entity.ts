import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Users } from './users.entity';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

@Entity()
export class EmailConfirmation {
  @Column()
  confirmationCode: string;
  @Column()
  expirationDate: Date;
  @Column()
  isConfirmed: boolean;
  @OneToOne(() => Users, (user) => user.emailConfirmation)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @PrimaryColumn()
  userId: number;

  static createEmailConfirmation(userId: number) {
    const emailConfirmation = new EmailConfirmation();
    emailConfirmation.confirmationCode = randomUUID();
    emailConfirmation.expirationDate = add(new Date(), {
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });
    emailConfirmation.isConfirmed = false;
    emailConfirmation.userId = userId;
    return emailConfirmation;
  }
}
