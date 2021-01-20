import { ContentError } from './../../../../../shared/exceptions/MessageError';
import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"
import { MessageError } from "../../../../../shared/exceptions/MessageError"

export namespace CreateCategoryErrors {
    export class NameAlreadyExistsError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
            message: new MessageError(ContentError.PARAM_EXISTED(), 'category').getMessage()
            } as UseCaseError)
        }
    }
}
