import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Either, Result } from './../../../../../shared/core/Result';
import { LoginErrors } from './LoginErrors';

export type LoginResponse = Either<
    LoginErrors.AccountInvalidError |
    LoginErrors.AccountStatusError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
