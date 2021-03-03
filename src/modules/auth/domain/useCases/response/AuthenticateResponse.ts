import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { JWTToken } from '../../../../../shared/services/auth/TokenAlias';
import { Either, Result } from '../../../../../shared/core/Result';
import { AuthenticateErrors } from '../errors/AuthenticateErrors';

export class UserAuthenticated {
    token: JWTToken
    email: string
    userId: string

    constructor(token: JWTToken, userId: string, email: string) {
        this.token = token
        this.userId = userId
        this.email = email
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
