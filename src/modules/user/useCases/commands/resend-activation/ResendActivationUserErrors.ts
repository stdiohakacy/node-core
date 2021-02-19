import { SystemError, MessageError } from './../../../../../shared/exceptions/SystemError';
import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from './../../../../../shared/core/Result';

export namespace ResendActivationUserErrors {
    export class EmailNotFoundError extends Result<UseCaseError> {    
        constructor (email: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, `email ${email}`).message
            })
        }
    }

    export class UserStatusError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: new SystemError(MessageError.PARAM_ACTIVATED, 'user').message
            })
        }
    }

    export class CannotSaveError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: new SystemError(MessageError.DATA_CANNOT_SAVE).message
            })
        }
    }
}
