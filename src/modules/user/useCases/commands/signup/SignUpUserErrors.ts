import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace SignUpUserErrors {
    export class EmailAlreadyExistsError extends Result<UseCaseError> {
        constructor(email: string) {
            super(false, {
                message: `The email ${email} is already existed!`
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
