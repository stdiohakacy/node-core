import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Either, Result } from '../../../../../shared/core/Result';
import { RefreshTokenUserErrors } from './RefreshTokenUserErrors';

export type RefreshTokenUserResponse = Either<
    RefreshTokenUserErrors.TokenNotFoundError |
    RefreshTokenUserErrors.UserNotFoundError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<any>
>
