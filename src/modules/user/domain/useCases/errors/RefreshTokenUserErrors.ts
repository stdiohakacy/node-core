import { SystemError, MessageError } from '../../../../../shared/exceptions/SystemError';
import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace RefreshTokenUserErrors {
    export class EmailNotFoundFromRedisError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, 'email').message
            } as UseCaseError)
        }
    }

    export class TokenNotFoundError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `Refresh token doesn't exist`
            } as UseCaseError)
        }
    }

    export class UserNotFoundError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, 'user').message
            } as UseCaseError)
        }
    }
}
