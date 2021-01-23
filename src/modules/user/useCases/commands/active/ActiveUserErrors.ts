import { MessageError, ContentError } from './../../../../../shared/exceptions/MessageError';
import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace ActiveUserErrors {
    export class DataInvalidError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: new MessageError(ContentError.DATA_INVALID()).getMessage()
            } as UseCaseError)
        }
    }

    export class ExpiredTimeError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: new MessageError(ContentError.PARAM_EXPIRED(), 'activation key').getMessage()
            })
        }
    }

    export class CannotSaveError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: new MessageError(ContentError.DATA_CANNOT_SAVE()).getMessage()
            })
        }
    }
}
