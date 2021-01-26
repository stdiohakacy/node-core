import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace UpdateCategoryErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: 'Not found error'
            } as UseCaseError)
        }
    }

    export class DataCannotSave extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: 'Data cannot save'
            } as UseCaseError)
        }
    }

    export class AlreadyExistsError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
            message: 'Already exists error'
            } as UseCaseError)
        }
    }
}
