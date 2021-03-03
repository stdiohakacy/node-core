import { JWTToken } from './../../../../../shared/services/auth/TokenAlias';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Either, Result } from '../../../../../shared/core/Result';
import { RefreshTokenUserErrors } from '../../../domain/useCases/errors/RefreshTokenUserErrors';

export type RefreshTokenUserResponse = Either<
    RefreshTokenUserErrors.TokenNotFoundError |
    RefreshTokenUserErrors.UserNotFoundError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<JWTToken>
>
