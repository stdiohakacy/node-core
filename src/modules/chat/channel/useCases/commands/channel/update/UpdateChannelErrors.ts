import { Result } from "../../../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../../../shared/core/UseCaseError"
import { MessageError, SystemError } from "../../../../../../../shared/exceptions/SystemError"

export namespace UpdateChannelErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor (id: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, `channel ${id}`).message
            })
        }
    }

    export class NameAlreadyExistsError extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_EXISTED, `channel ${name}`).message
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
