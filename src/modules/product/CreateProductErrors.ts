import { SystemError, MessageError } from './../../shared/exceptions/SystemError';
import { Result } from "../../shared/core/Result"
import { UseCaseError } from "../../shared/core/UseCaseError"

export namespace CreateProductErrors {
    export class NameAlreadyExistsError extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_EXISTED, `product ${name}`).message
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
