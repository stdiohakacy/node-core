import { SystemError, MessageError } from './../../../../../shared/exceptions/SystemError';
import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace AuthenticateErrors {
    export class TokenInvalidError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: new SystemError(MessageError.PARAM_INVALID, 'access token').message
            })
        }
    }
    
    export class TokenExpireTimeError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message:  new SystemError(MessageError.PARAM_EXPIRED, 'access token').message
            })
        }
    }

    export class AccessDeniedError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: new SystemError(MessageError.ACCESS_DENIED).message
            })
        }
    }
}
