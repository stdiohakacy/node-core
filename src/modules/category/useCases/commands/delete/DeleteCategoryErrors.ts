import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace DeleteCategoryErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor (id: string) {
            super(false, {
                message: `The category ${id} was not found!`
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
