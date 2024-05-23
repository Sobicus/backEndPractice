import { SessionQueryRepository } from '../security/repository/session.query.repository';
import { SessionRepository } from '../security/repository/session.repository';
import { AuthService } from './service/auth.service';
import { ChangeUserConfirmationUseCase } from './service/useCases/change-User-Confirmation.useCase';
import { EmailResendingUseCase } from './service/useCases/email-resending.useCase';
import { RefreshTokenUseCase } from './service/useCases/refresh-token.useCase';
import { GetInformationAboutUserCase } from './service/useCases/user-get-information-about-me.useCase';
import { UserLoginUseCase } from './service/useCases/user-login.useCase';
import { UserRegistrationUseCase } from './service/useCases/user-registration.UseCase';

export const authProviders = [AuthService, SessionRepository, SessionQueryRepository];
export const authUseCases = [
  UserRegistrationUseCase,
  UserLoginUseCase,
  GetInformationAboutUserCase,
  RefreshTokenUseCase,
  EmailResendingUseCase,
  ChangeUserConfirmationUseCase,
];
