import { MessageError, ContentError } from './../../../../../shared/exceptions/MessageError';
import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace UpdateCategoryErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: new MessageError(ContentError.PARAM_NOT_EXISTS(), 'category').getMessage()
            } as UseCaseError)
        }
    }

    export class NameAlreadyExistsError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
            message: new MessageError(ContentError.PARAM_EXISTED(), 'category').getMessage()
            } as UseCaseError)
        }
    }
}
