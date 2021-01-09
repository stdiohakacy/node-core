import { UseCaseError } from "../../../../shared/core/UseCaseError"
import { Result } from "../../../../shared/core/Result"

export namespace UpdateCategoryErrors {
    export class CategoryNotFoundError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
            message: `Category not found`
            } as UseCaseError)
        }
    }
}
