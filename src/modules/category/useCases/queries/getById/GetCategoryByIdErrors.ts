import { ContentError } from './../../../../../shared/exceptions/MessageError';
import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"
import { MessageError } from "../../../../../shared/exceptions/MessageError"

export namespace GetCategoryByIdErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
            message: new MessageError(ContentError.PARAM_NOT_EXISTS(), 'category').getMessage()
            } as UseCaseError)
        }
    }
}
