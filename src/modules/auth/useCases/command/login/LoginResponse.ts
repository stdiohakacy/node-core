import { JWTToken, RefreshToken } from '../../../../../shared/services/auth/TokenAlias';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Either, Result } from './../../../../../shared/core/Result';
import { LoginErrors } from './LoginErrors';

type LoginDTOResponse = {
    accessToken: JWTToken,
    refreshToken: RefreshToken
}

export type LoginResponse = Either<
    LoginErrors.AccountInvalidError |
    LoginErrors.AccountStatusError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<LoginDTOResponse>
>
