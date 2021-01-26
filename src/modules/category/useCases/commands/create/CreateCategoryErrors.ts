import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace CreateCategoryErrors {
    export class AlreadyExistsError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: 'Already exists error'
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
}
