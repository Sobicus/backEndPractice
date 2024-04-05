import { UserQueryRepository } from './repositories/user.query.repository';
import { UserRepository } from './repositories/userRepository';
import { UserService } from './services/user.service';

export const userProviders = [UserRepository, UserQueryRepository, UserService];
