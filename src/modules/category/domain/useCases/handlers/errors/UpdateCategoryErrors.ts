import { SystemError, MessageError } from '../../../../../../shared/exceptions/SystemError';
import { UseCaseError } from "../../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../../shared/core/Result"

export namespace UpdateCategoryErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor (id: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, `category ${id}`).message
            })
        }
    }

    export class NameAlreadyExistsError extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_EXISTED, `category ${name}`).message
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
