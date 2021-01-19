import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace GetCategoryByIdErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor (id: string | number) {
            super(false, {
            message: `The category with id : ${id} not found`
            } as UseCaseError)
        }
    }
}
