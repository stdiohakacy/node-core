import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace CreateCategoryErrors {
    export class NameAlreadyExistsError extends Result<UseCaseError> {    
        constructor (name: string) {
            super(false, {
            message: `The name ${name} already exists`
            } as UseCaseError)
        }
    }
}
