import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { SystemError, MessageError } from "../../../../../shared/exceptions/SystemError"

export namespace LoginErrors {
    export class AccountInvalidError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: new SystemError(MessageError.ACCOUNT_WRONG).message
            })
        }
    }
    
    export class AccountStatusError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_ACTIVATED, 'account').message
            })
        }
    }
}
