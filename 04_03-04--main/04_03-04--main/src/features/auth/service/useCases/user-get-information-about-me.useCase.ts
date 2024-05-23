import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserQueryRepository } from '../../../users/repositories/user.query.repository';
import { AboutMeType } from '../../types/output';

export class UserGetInformationAboutMeCommand {
  constructor(public userId: string) {}
}
@CommandHandler(UserGetInformationAboutMeCommand)
export class GetInformationAboutUserCase implements ICommandHandler<UserGetInformationAboutMeCommand> {
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute({ userId }: UserGetInformationAboutMeCommand): Promise<AboutMeType> {
    const user = await this.userQueryRepository.getUserById(userId);
    if (!user) throw new NotFoundException();
    const { email, login, id } = user;
    return { email, login, userId: id };
  }
}
