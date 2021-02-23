import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Either, Result } from '../../../../../shared/core/Result';
import { LogoutUserErrors } from './LogoutUserErrors';

export type LogoutUserResponse = Either<
    LogoutUserErrors.NotFoundError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
