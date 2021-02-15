import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace LoginErrors {
    export class AccountInvalidError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: `Wrong email or password`
            })
        }
    }
    
    export class AccountStatusError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: `The account has not been actived`
            })
        }
    }
}
