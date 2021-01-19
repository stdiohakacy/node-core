import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace UpdateCategoryErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor (id: string) {
            super(false, {
            message: `Category with id : ${id} not found`
            } as UseCaseError)
        }
    }

    export class NameAlreadyExistsError extends Result<UseCaseError> {    
        constructor (name: string) {
            super(false, {
            message: `Category name : ${name} is taken`
            } as UseCaseError)
        }
    }
}
