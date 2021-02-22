import { Result } from './../../../shared/core/Result';
import { UseCaseError } from "../../../shared/core/UseCaseError";
import { MessageError, SystemError } from '../../../shared/exceptions/SystemError';

export namespace CreateMessageErrors {
    export class DataCannotSave extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: new SystemError(MessageError.DATA_CANNOT_SAVE).message
            })
        }
    }
    export class ChannelNotFoundError extends Result<UseCaseError> {
        constructor () {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, 'channel').message
            })
        }
    }
}
