import { SystemError, MessageError } from '../../../../../../shared/exceptions/SystemError';
import { UseCaseError } from "../../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../../shared/core/Result"

export namespace GetCategoryByIdErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor (id: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, `category ${id}`).message
            })
        }
    }
}
