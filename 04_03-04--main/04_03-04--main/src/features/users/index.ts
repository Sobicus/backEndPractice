import { UserQueryRepository } from './repositories/user.query.repository';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

export const userProviders = [UserRepository, UserQueryRepository, UserService];
