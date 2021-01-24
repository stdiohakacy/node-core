import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace GetCategoryByIdErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
            message: 'not found error'
            } as UseCaseError)
        }
    }
}
