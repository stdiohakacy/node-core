import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Either, Result } from './../../../../../shared/core/Result';
import { ActiveUserErrors } from './ActiveUserErrors';

export type ActiveUserResponse = Either<
    ApplicationError.UnexpectedError | 
    ActiveUserErrors.CannotSaveError | 
    ActiveUserErrors.DataInvalidError |
    ActiveUserErrors.ExpiredTimeError |
    Result<void>
    , Result<boolean>
>
