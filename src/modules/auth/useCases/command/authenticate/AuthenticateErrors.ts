import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace AuthenticateErrors {
    export class TokenInvalidError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: `The access token is invalid`
            })
        }
    }
    
    export class TokenExpireTimeError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: `The access token has expired`
            })
        }
    }
    
    export class AccessDeniedError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: `Access is denied`
            })
        }
    }
}
