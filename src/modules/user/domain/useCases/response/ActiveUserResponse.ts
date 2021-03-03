import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Either, Result } from '../../../../../shared/core/Result';
import { ActiveUserErrors } from '../errors/ActiveUserErrors';

export type ActiveUserResponse = Either<
    ActiveUserErrors.ActiveKeyInvalidError |
    ActiveUserErrors.CannotSaveError |
    ActiveUserErrors.ExpiredTimeError |
    ActiveUserErrors.EmailNotFoundError |
    ActiveUserErrors.UserStatusError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
