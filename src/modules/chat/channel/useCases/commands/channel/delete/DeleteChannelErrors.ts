import { UseCaseError } from '../../../../../../../shared/core/UseCaseError';
import { MessageError, SystemError } from '../../../../../../../shared/exceptions/SystemError';
import { Result } from './../../../../../../../shared/core/Result';

export namespace DeleteChannelErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor (id: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, `channel ${id}`).message
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
