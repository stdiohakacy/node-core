import { SystemError, MessageError } from '../../../../../../shared/exceptions/SystemError';
import { UseCaseError } from '../../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../../shared/core/Result';

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
