import { SystemError, MessageError } from './../../../../../shared/exceptions/SystemError';
import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace ResetPasswordUserErrors {
    export class EmailNotFoundError extends Result<UseCaseError> {    
        constructor (email: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, `email ${email}`).message
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

    export class ForgotKeyInvalidError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: new SystemError(MessageError.PARAM_INVALID, 'forgot key').message
            })
        }
    }

    export class ExpiredTimeError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: new SystemError(MessageError.PARAM_EXPIRED, 'forgot key').message
            })
        }
    }
}
