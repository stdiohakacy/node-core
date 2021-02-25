import { MessageError } from '../../../../../../shared/exceptions/SystemError';
import { Result } from "../../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../../shared/core/UseCaseError"
import { SystemError } from "../../../../../../shared/exceptions/SystemError"

export namespace CreatePrivateMessageErrors {
    export class UserNotFoundError extends Result<UseCaseError> {
        constructor(id: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, `user ${id}`).message
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
