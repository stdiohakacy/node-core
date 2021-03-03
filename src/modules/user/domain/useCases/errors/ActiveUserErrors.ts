import { SystemError, MessageError } from './../../../../../shared/exceptions/SystemError';
import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace ActiveUserErrors {
    export class EmailNotFoundError extends Result<UseCaseError> {    
        constructor (email: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, `email ${email}`).message
            })
        }
    }
    export class ActiveKeyInvalidError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: new SystemError(MessageError.PARAM_INVALID, 'active key').message
            })
        }
    }

    export class ExpiredTimeError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: new SystemError(MessageError.PARAM_EXPIRED, 'active key').message
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
        constructor() {
            super(false, {
                message: new SystemError(MessageError.DATA_CANNOT_SAVE).message
            })
        }
    }
}
