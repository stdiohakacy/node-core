import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace CreateCategoryErrors {
    export class NameAlreadyExistsError extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: `The category ${name} is already existed!`
            })
        }
    }
    export class DataCannotSave extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: 'Data cannot save'
            })
        }
    }
}
