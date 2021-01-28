import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Either, Result } from './../../../../../shared/core/Result';
import { ActiveUserErrors } from './ActiveUserErrors';

export type ActiveUserResponse = Either<
    ActiveUserErrors.ActiveKeyInvalid |
    ActiveUserErrors.CannotSaveError |
    ActiveUserErrors.ExpiredTimeError |
    ActiveUserErrors.NotFoundError |
    ActiveUserErrors.UserStatusError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
