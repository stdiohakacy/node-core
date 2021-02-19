import { SystemError, MessageError } from './../../../../../shared/exceptions/SystemError';
import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace SignUpUserErrors {
    export class EmailAlreadyExistsError extends Result<UseCaseError> {
        constructor(email: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_EXISTED, `email ${email}`).message
            })
        }
    }
    export class DataCannotSave extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: new SystemError(MessageError.DATA_CANNOT_SAVE).message
            })
        }
    }
}
