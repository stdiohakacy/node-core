import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"

export namespace SignUpUserErrors {
    export class EmailAlreadyExistsError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: 'Email already exists Error'
            } as UseCaseError)
        }
    }
    export class CannotSaveError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: 'Cannot Save Error'
            } as UseCaseError)
        }
    }
}
