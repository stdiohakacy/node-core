import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace UpdateCategoryErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: 'not found error'
            } as UseCaseError)
        }
    }

    export class NameAlreadyExistsError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
            message: 'name already exist error'
            } as UseCaseError)
        }
    }
}
