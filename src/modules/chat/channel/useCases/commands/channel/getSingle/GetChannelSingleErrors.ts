import { Result } from "../../../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../../../shared/core/UseCaseError"
import { MessageError, SystemError } from "../../../../../../../shared/exceptions/SystemError"

export namespace GetChannelSingleErrors {
    export class ReceiverNotfoundError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, 'receiver').message
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
