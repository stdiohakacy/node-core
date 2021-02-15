import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { JWTToken } from '../../../../../shared/services/auth/TokenAlias';
import { Either, Result } from './../../../../../shared/core/Result';
import { AuthenticateErrors } from './AuthenticateErrors';

export class UserAuthenticated {
    token: JWTToken
    userId: string

    constructor(token: JWTToken, userId: string) {
        this.token = token
        this.userId = userId
    }
}

export type AuthenticateResponse = Either<
    AuthenticateErrors.TokenInvalidError |
    AuthenticateErrors.AccessDeniedError |
    AuthenticateErrors.TokenExpireTimeError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<UserAuthenticated>
>
